import json
import os.path
import csv
import glob
import epidoc


csv_fieldnames = [
    "tm",
    "apd",
    "apisid",
    "dclp",
    "ddb_hybrid",
    "ddb_persus_style",
    "hgv",
    "idno_raw",
    "title",
    "raw_title",
    "terms",
    "terms_raw",
    "material",
    "edition_language",
    "commentary",
    "origin_dates_when",
    "origin_dates_notbefore",
    "origin_dates_notafter",
    "origin_dates_raw",
    "origin_places",
    "origin_places_raw",
    "provenances_located",
    "provenances_found",
    "provenances_raw",
    "edition_foreign_languages",
    "languages",
    "languages_raw",
    "reprint_from",
    "reprint_in",
    "file",
]


def source_to_json(data_repo: str, source: str, result_filename: str):
    with open(result_filename, "w") as material_f:
        for doc in glob.glob(os.path.join(data_repo, source, "**", "*.xml"), recursive=True):
            with open(doc) as f:
                ed = epidoc.load(f)
            material_f.write(json.dumps(convert_fields(ed, doc.replace(data_repo, ""))) + "\n")


def source_to_csv(data_repo: str, source: str, result_filename: str):
    with open(result_filename, "w") as material_f:
        writer = csv.DictWriter(material_f, fieldnames=csv_fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        for doc in glob.glob(os.path.join(data_repo, source, "**", "*.xml"), recursive=True):
            with open(doc) as f:
                ed = epidoc.load(f)
            writer.writerow(convert_fields(ed, doc.replace(data_repo, "")))


def create_list(elements, field):
    if not elements:
        return None
    result = []
    for elem in elements:
        if not elem:
            continue
        value = elem.get(field)
        if not value:
            continue
        result.append(value)
    if not result:
        return None
    return result


def convert_fields(doc, file):
    result = {}
    result["raw_title"] = doc.title
    result["title"] = None if doc.title and doc.title.lower() in ["keiner", "unknown"] else doc.title
    result["idno_raw"] = doc.idno
    result["tm"] = doc.idno.get("tm")
    result["apd"] = doc.idno.get("apd")
    result["apisid"] = doc.idno.get("apisid")
    result["dclp"] = doc.idno.get("dclp")
    result["ddb_hybrid"] = doc.idno.get("ddb-hybrid")
    result["ddb_persus_style"] = doc.idno.get("ddb-persus-style")
    result["hgv"] = doc.idno.get("hgv")
    result["material"] = doc.material
    result["origin_dates_raw"] = doc.origin_dates
    result["origin_dates_when"] = create_list(doc.origin_dates, "when")
    result["origin_dates_notbefore"] = create_list(doc.origin_dates, "notbefore")
    result["origin_dates_notafter"] = create_list(doc.origin_dates, "notafter")
    result["origin_places_raw"] = doc.origin_place
    result["origin_places"] = doc.origin_place.get("text") if doc.origin_place.get("text") != "unbekannt" else None
    result["provenances_raw"] = doc.provenances
    result["provenances_located"] = create_list(doc.provenances.get("located"), "text")
    result["provenances_found"] = create_list(doc.provenances.get("found"), "text")
    result["terms_raw"] = doc.terms
    result["terms"] = create_list(doc.terms, "text")
    result["languages_raw"] = doc.languages
    result["languages"] = list(doc.languages.keys()) if doc.languages else None
    result["commentary"] = doc.commentary
    result["edition_language"] = doc.edition_language
    result["edition_foreign_languages"] = doc.edition_foreign_languages if doc.edition_foreign_languages else None
    result["reprint_from"] = doc.reprint_from
    result["reprint_in"] = doc.reprint_in
    result["file"] = file
    return result
