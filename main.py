import argparse
import concurrent.futures
import csv
import logging
import os.path
import json
import glob
from typing import Optional

import epidoc

from merge import csv_fieldnames, convert

idp_data_repo = ""
output_dir = "out"


def convert_source(source: str):
    try:
        with open(os.path.join(output_dir, f"source-{source.lower()}.json"), "w") as result_file:
            for doc in glob.glob(os.path.join(idp_data_repo, source, "**", "*.xml"), recursive=True):
                with open(doc) as f:
                    ed = epidoc.load(f)

                result_file.write(
                    json.dumps(
                        {
                            "tm": ed.idno.get("tm"),
                            "file": doc.replace(idp_data_repo, ""),
                        }
                    )
                    + "\n"
                )
    except Exception as e:
        return e


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
                tms: Optional[str] = ed.get("tm")

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


def merge(idp_data_repo):
    with open(os.path.join(output_dir, "tms.json")) as tms_file:
        with open(os.path.join("ipd-data-sheet.csv"), "w") as res_f:
            writer = csv.DictWriter(res_f, fieldnames=csv_fieldnames, quoting=csv.QUOTE_ALL)
            writer.writeheader()
            for line in tms_file.readlines():
                doc = json.loads(line)
                tm = doc.get("tm")
                files = doc.get("files")
                try:
                    writer.writerow(convert(tm, files, idp_data_repo=idp_data_repo))
                except Exception as e:
                    logging.warning(f"tm={tm}: {e}")


def main(data_path: str, sources: list[str]):
    # Due to the concurrent function below a global variable is used.
    global idp_data_repo
    idp_data_repo = data_path

    # Step 1: Convert sources to 1 JSON file per source with the required information.
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        for result in executor.map(convert_source, sources):
            if isinstance(result, Exception):
                raise result

    # Step 2: Group by TM.
    group_by_tm()

    # Step 3: Create sheet
    merge(idp_data_repo=data_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Convert IDP Date to CSV or JSON")
    parser.add_argument("--path", help="Path to the cloned repository https://github.com/papyri/idp.data", type=str)
    args = parser.parse_args()

    path: str = args.path
    if not os.path.isdir(path):
        raise TypeError(f"{path} is not a directory")

    main(path, sources=["APD", "APIS", "DCLP", "DDB_EpiDoc_XML", "HGV_meta_EpiDoc", "HGV_trans_EpiDoc"])
