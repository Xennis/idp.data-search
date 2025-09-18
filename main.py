import argparse
import concurrent.futures
import csv
import logging
import os.path
import json
import glob
from typing import Optional, Any

import epidoc

from merge import csv_fieldnames, convert

idp_data_repo = ""
output_dir = "out"


def convert_source(source: str):
    try:
        with open(os.path.join(output_dir, f"source-{source.lower()}.json"), "w") as result_file:
            for doc in glob.glob(os.path.join(idp_data_repo, source, "**", "*.xml"), recursive=True):
                try:
                    with open(doc) as f:
                        ed = epidoc.load(f)

                    result_file.write(
                        json.dumps(
                            {
                                "tms": ed.idno.get("tm"),
                                "file": doc.replace(f"{idp_data_repo}{os.sep}", ""),
                            }
                        )
                        + "\n"
                    )
                except Exception as e:
                    raise RuntimeError(f"Failed to process doc '${doc}'") from e
    except Exception as e:
        return e  # returned and not raised due to concurrent execution


def group_by_tm():
    result = {}
    count_total = 0
    count_missing = 0

    for doc in glob.glob(os.path.join(output_dir, "source-*.json")):
        with open(doc) as source_file:
            for line in source_file.readlines():
                count_total += 1

                ed: dict[str, str] = json.loads(line)
                file: str = ed["file"]
                tms: Optional[str] = ed.get("tms")

                if tms is None:
                    count_missing += 1
                    continue

                for tm in tms.split(" "):
                    if tm in result:
                        result[tm].append(file)
                    else:
                        result[tm] = [file]

    with open(os.path.join(output_dir, "tms.json"), "w") as tms_f:
        for tm, files in result.items():
            tms_f.write(json.dumps({"tm": tm, "files": files}) + "\n")

    logging.warning(f"{count_missing:,} of {count_total:,} files had no TM number.")


def merge_process_fn(args: list[str, int, int]) -> list[dict[str, Any]]:
    filename, start, stop = args
    entries = []
    with open(filename) as fh:
        fh.seek(start)
        for line in fh.readlines(stop - start):
            doc = json.loads(line)
            tm = doc.get("tm")
            files = doc.get("files")
            entries.append(convert(tm, files, idp_data_repo=idp_data_repo))

    return entries


def flatten_single_value_lists(line: dict[str, Any]) -> dict[str, Any]:
    """
    Replace all values that are lists of size 1 with their single element.
    """
    for key, value in line.items():
        if isinstance(value, list) and len(value) == 1:
            line[key] = value[0]
    return line


def merge(format: str):
    grouped_result_file = os.path.join(output_dir, "tms.json")
    file_size = os.path.getsize(grouped_result_file)
    split_size = 1024 * 1024

    fn_args = []
    with open(grouped_result_file) as tms_file:
        cursor = 0
        for chunk in range(file_size // split_size):
            # determine the end of the chunk
            if cursor + split_size > file_size:
                end = file_size
            else:
                end = cursor + split_size

            # seek the end of the chunk and ensure it is an entire line
            tms_file.seek(end)
            tms_file.readline()
            end = tms_file.tell()  # current location

            fn_args.append([grouped_result_file, cursor, end])
            cursor = end  # setup next chunk

    entries = []
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        for fn_result in executor.map(merge_process_fn, fn_args):
            if isinstance(fn_result, Exception):
                raise fn_result
            entries.extend(fn_result)

    file_extension = "jsonl" if format == "json" else "csv"
    with open(os.path.join(output_dir, f"ipd-data-sheet.{file_extension}"), "w") as res_f:
        if format == "csv":
            writer = csv.DictWriter(res_f, fieldnames=csv_fieldnames, quoting=csv.QUOTE_ALL)
            writer.writeheader()
            for line in entries:
                writer.writerow(flatten_single_value_lists(line))
        elif format == "json":
            for line in entries:
                res_f.write(f"{json.dumps(line, separators=(",", ":"))}\n")
        else:
            raise Exception(f"Unsupported format '{format}'")


def main(data_path: str, sources: list[str], step: Optional[str], format: str):
    # Due to the concurrent function below a global variable is used.
    global idp_data_repo
    idp_data_repo = data_path

    # Step 1: Convert sources to 1 JSON file per source with the required information.
    if step is None or step == "convert":
        with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
            for result in executor.map(convert_source, sources):
                if isinstance(result, Exception):
                    raise result

    # Step 2: Group by TM.
    if step is None or step == "group":
        group_by_tm()

    # Step 3: Create sheet
    if step is None or step == "merge":
        merge(format=format)


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Convert IDP data to a single CSV file")
    parser.add_argument("--path", help="Path to the cloned repository https://github.com/papyri/idp.data", required=True)
    parser.add_argument("--step", help="Execute only a single step", choices=["convert", "group", "merge"])
    parser.add_argument("--format", help="Output file format", choices=["csv", "json"], default="csv")
    args = parser.parse_args()

    path: str = args.path
    if not os.path.isdir(path):
        raise TypeError(f"{path} is not a directory")

    main(
        path,
        sources=["APD", "APIS", "DCLP", "DDB_EpiDoc_XML", "HGV_meta_EpiDoc", "HGV_trans_EpiDoc"],
        step=args.step,
        format=args.format,
    )
