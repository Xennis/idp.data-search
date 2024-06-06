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
    "origin_dates_when",
    "origin_dates_notbefore",
    "origin_dates_notafter",
    "origin_places",
    "provenances_located",
    "provenances_found",
    # Information about the source of this entry
    "source_files",
    "source_authority",
    "source_availability",
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


def merge(result: dict[str, Any], field: str, value: Any) -> None:
    current = result.get(field)
    if current is None:
        result[field] = value
        return

    if current == value or value is None:
        return

    result[field] = [current, value]


def convert(tm: str, files: list[str], idp_data_repo: str) -> dict[str, Any]:
    result = {
        "tm": tm,
        # "trismegistos_url": f"https://www.trismegistos.org/text/{tm}",
        "source_files": files,
    }
    for file in files:

        # FIXME: Using `join` is somehow not working. Maybe because the path ends with "ipd.data"?
        # filepath = os.path.join(idp_data_repo, file)
        filepath = f"{idp_data_repo}{file}"
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
            merge(result, "terms", [term.get("text") for term in doc.terms])
            merge(result, "title", doc.title)
            merge(result, "material", doc.material)
            merge(result, "origin_dates_when", create_list(doc.origin_dates, "when"))
            merge(result, "origin_dates_notbefore", create_list(doc.origin_dates, "notbefore"))
            merge(result, "origin_dates_notafter", create_list(doc.origin_dates, "notafter"))
            merge(result, "origin_places", doc.origin_place.get("text"))
            merge(result, "provenances_located", create_list(doc.provenances.get("located"), "text"))
            merge(result, "provenances_found", create_list(doc.provenances.get("found"), "text"))
            merge(result, "source_authority", doc.authority)
            merge(result, "source_availability", doc.availability)
        elif file.startswith("DDB_EpiDoc_XML"):
            # url: f"http://papyri.info/ddbdp/{ddb_hybrid}" with `ddb_hybrid = doc.idno.get("ddb-hybrid")`

            # lang_usage = list(doc.languages.keys())
            # if 'en' in lang_usage:
            #     lang_usage.remove('en')
            # result['langUsage'] = lang_usage
            merge(result, "mainLang", doc.edition_language)
            merge(result, "foreignLang", doc.edition_foreign_languages if doc.edition_foreign_languages else None)
            # 'sources' field used instead of:
            # merge(result, "ddb_url", f"http://papyri.info/ddbdp/{ddb_hybrid}")
            merge(result, "source_authority", doc.authority)
            merge(result, "source_availability", doc.availability)
        elif file.startswith("HGV_meta_EpiDoc"):
            # url: f"http://papyri.info/hgv/{tm}"
            merge(result, "terms", [term.get("text") for term in doc.terms])
            merge(result, "title", doc.title)
            merge(result, "commentary", doc.commentary)
            merge(result, "material", doc.material)
            merge(result, "origin_dates_when", create_list(doc.origin_dates, "when"))
            merge(result, "origin_dates_notbefore", create_list(doc.origin_dates, "notbefore"))
            merge(result, "origin_dates_notafter", create_list(doc.origin_dates, "notafter"))
            merge(result, "origin_places", doc.origin_place.get("text"))
            merge(result, "provenances_located", create_list(doc.provenances.get("located"), "text"))
            merge(result, "provenances_found", create_list(doc.provenances.get("found"), "text"))
            merge(result, "source_authority", doc.authority)
            merge(result, "source_availability", doc.availability)
        elif file.startswith("HGV_trans_EpiDoc"):
            pass

    return result
