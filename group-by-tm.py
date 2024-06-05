import glob
import json
import logging
import os.path


def main():
    result = {}
    count_entries = 0
    count_entries_without_tm = 0

    for doc in glob.glob(os.path.join("source-*.json")):
        with open(doc) as source_f:
            for line in source_f.readlines():
                ed = json.loads(line)
                count_entries = count_entries + 1
                file: str = ed.get("file")
                tms: str = ed.get("tm")
                if tms:
                    for tm in tms.split(" "):
                        if tm in result:
                            result[tm].append(file)
                        else:
                            result[tm] = [file]
                else:
                    count_entries_without_tm = count_entries_without_tm + 1

    with open("tms.json", "w") as tms_f:
        for tm, files in result.items():
            tms_f.write(json.dumps({"tm": tm, "files": files}) + "\n")

    logging.warning(f"{count_entries_without_tm:,} of {count_entries:,} files had no TM number.")


if __name__ == "__main__":
    main()
