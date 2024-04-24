import concurrent.futures
import os.path

from convert import source_to_csv, source_to_json

# TODO: Config path to https://github.com/papyri/idp.data
idp_path = os.path.join("/path/to/idp.data")


def run_csv(source):
    try:
        source_to_csv(os.path.join(idp_path, source), result_filename=f"source-{source.lower()}.csv")
    except Exception as e:
        return e


def run_json(source):
    try:
        source_to_json(os.path.join(idp_path, source), result_filename=f"source-{source.lower()}.json")
    except Exception as e:
        return e


def main(sources):
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        for result in executor.map(run_csv, sources):
            if isinstance(result, Exception):
                raise result


if __name__ == "__main__":
    main(["APD", "APIS", "DCLP", "DDB_EpiDoc_XML", "HGV_meta_EpiDoc", "HGV_trans_EpiDoc"])
