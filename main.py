import argparse
import concurrent.futures
import os.path

from convert import source_to_csv, source_to_json

idp_data_repo = ""


def run_csv(source: str):
    try:
        source_to_csv(idp_data_repo, source=source, result_filename=f"source-{source.lower()}.csv")
    except Exception as e:
        return e


def run_json(source: str):
    try:
        source_to_json(idp_data_repo, source=source, result_filename=f"source-{source.lower()}.json")
    except Exception as e:
        return e


def main(data_path: str, sources: list[str]):
    # Due to the concurrent function below a global variable is used.
    global idp_data_repo
    idp_data_repo = data_path
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        for result in executor.map(run_csv, sources):
            if isinstance(result, Exception):
                raise result


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Convert IDP Date to CSV or JSON")
    parser.add_argument("--path", help="Path to the cloned repository https://github.com/papyri/idp.data", type=str)
    args = parser.parse_args()

    path: str = args.path
    if not os.path.isdir(path):
        raise TypeError(f"{path} is not a directory")

    main(path, sources=["APD", "APIS", "DCLP", "DDB_EpiDoc_XML", "HGV_meta_EpiDoc", "HGV_trans_EpiDoc"])
