import os.path
from typing import Any, Optional
import epidoc


csv_fieldnames = [
    "tm",
    "title",
    "terms",
    "material",
    "commentary",
    "mainLang",
    "foreignLang",
    "originDatesWhen",
    "originDatesNotbefore",
    "originDatesNotafter",
    "originPlaces",
    "provenancesLocated",
    "provenancesFound",
    # Information about the source of this entry
    "sourceFiles",
    "sourceAuthority",
    "sourceAvailability",
]


def create_list(elements, field: str) -> Optional[list[Any]]:
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


def merge_single(result: dict[str, Any], field: str, value: Optional[Any]) -> None:
    if value is None:
        return

    current = result.get(field)
    if current is None:
        result[field] = value
        return

    merged_before = isinstance(current, list)
    if not merged_before:
        if current == value:
            return  # Same value

        result[field] = [current, value]
    else:
        if any(value == c for c in current):
            return  # Same value

        result[field] = current.append(value)


def merge_list(result: dict[str, Any], field: str, value: Optional[list[Any]]) -> None:
    if value is None:
        return

    current = result.get(field)
    if current is None:
        result[field] = value
        return

    merged_before = len(current) > 0 and isinstance(current[0], list)
    if not merged_before:
        if current == value:
            return

        result[field] = [current, value]
    else:
        # FIXME: Here is no check if the list already exists
        result[field] = current.extend(value)


def convert(tm: str, files: list[str], idp_data_repo: str) -> dict[str, Any]:
    result = {
        "tm": tm,
        "sourceFiles": files,
    }
    for file in files:

        filepath = os.path.join(idp_data_repo, file)
        with open(filepath) as f:
            doc = epidoc.load(f)

        if len(doc.reprint_in) > 0:
            continue

        if file.startswith("APD"):
            pass
        elif file.startswith("APIS"):
            pass
        elif file.startswith("DCLP"):
            # url: f"http://papyri.info/dclp/{tm}"
            merge_list(result, "terms", [term.get("text") for term in doc.terms])
            merge_single(result, "title", doc.title)
            merge_single(result, "material", doc.material)
            merge_list(result, "originDatesWhen", create_list(doc.origin_dates, "when"))
            merge_list(result, "originDatesNotbefore", create_list(doc.origin_dates, "notbefore"))
            merge_list(result, "originDatesNotafter", create_list(doc.origin_dates, "notafter"))
            merge_single(result, "originPlaces", doc.origin_place.get("text"))
            merge_list(result, "provenancesLocated", create_list(doc.provenances.get("located"), "text"))
            merge_list(result, "provenancesFound", create_list(doc.provenances.get("found"), "text"))
            merge_single(result, "sourceAuthority", doc.authority)
            merge_single(result, "sourceAvailability", doc.availability)
        elif file.startswith("DDB_EpiDoc_XML"):
            # url: f"http://papyri.info/ddbdp/{ddb_hybrid}" with `ddb_hybrid = doc.idno.get("ddb-hybrid")`

            # lang_usage = list(doc.languages.keys())
            # if 'en' in lang_usage:
            #     lang_usage.remove('en')
            # result['langUsage'] = lang_usage
            merge_single(result, "mainLang", doc.edition_language)
            merge_single(result, "foreignLang", doc.edition_foreign_languages)
            # 'sources' field used instead of:
            # merge(result, "ddb_url", f"http://papyri.info/ddbdp/{ddb_hybrid}")
            merge_list(result, "sourceAuthority", doc.authority)
            merge_list(result, "sourceAvailability", doc.availability)
        elif file.startswith("HGV_meta_EpiDoc"):
            # url: f"http://papyri.info/hgv/{tm}"
            merge_list(result, "terms", [term.get("text") for term in doc.terms])
            merge_single(result, "title", doc.title)
            merge_single(result, "commentary", doc.commentary)
            merge_single(result, "material", doc.material)
            merge_list(result, "originDatesWhen", create_list(doc.origin_dates, "when"))
            merge_list(result, "originDatesNotbefore", create_list(doc.origin_dates, "notbefore"))
            merge_list(result, "originDatesNotafter", create_list(doc.origin_dates, "notafter"))
            merge_single(result, "originPlaces", doc.origin_place.get("text"))
            merge_list(result, "provenancesLocated", create_list(doc.provenances.get("located"), "text"))
            merge_list(result, "provenancesFound", create_list(doc.provenances.get("found"), "text"))
            merge_single(result, "sourceAuthority", doc.authority)
            merge_single(result, "sourceAvailability", doc.availability)
        elif file.startswith("HGV_trans_EpiDoc"):
            pass

    return result
