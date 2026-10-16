
"""
Batch validation for Vaycogo destination imports.

Ensures destination batches contain unique Wikidata IDs
and all requested destinations are accounted for.
"""

import re
from collections import Counter
from collections.abc import Iterable

from app.modules.explore.schemas.destination import DestinationData


class DestinationBatchValidationError(ValueError):
  """Raised when a destination import batch is invalid."""


def validate_destination_batch(
  destinations: Iterable[DestinationData],
  requested_wikidata_ids: Iterable[str],
  expected_names: dict[str, str] | None = None,
) -> list[DestinationData]:
  """
  Validate a batch before database persistence.

  Raises DestinationBatchValidationError if:
  - Requested Wikidata IDs are invalid or duplicated.
  - Returned destinations contain duplicate Wikidata IDs.
  - Any requested destination is missing.
  - An unexpected destination is returned.
  """

  records = list(destinations)
  requested_ids = list(requested_wikidata_ids)

  if not requested_ids:
    raise DestinationBatchValidationError(
      "At least one Wikidata ID is required."
    )

  invalid_requested = [
    wikidata_id
    for wikidata_id in requested_ids
    if not isinstance(wikidata_id, str)
    or re.fullmatch(r"Q[1-9][0-9]*", wikidata_id) is None
  ]

  if invalid_requested:
    raise DestinationBatchValidationError(
      f"Invalid requested Wikidata IDs: {invalid_requested}"
    )

  invalid_records = [
    index
    for index, record in enumerate(records)
    if not isinstance(record, DestinationData)
  ]

  if invalid_records:
    raise DestinationBatchValidationError(
      f"Unvalidated destination records at indexes: "
      f"{invalid_records}"
    )

  requested_counts = Counter(requested_ids)
  returned_counts = Counter(
    record.wikidata_id for record in records
  )

  duplicate_requested = sorted(
    wikidata_id
    for wikidata_id, count in requested_counts.items()
    if count > 1
  )

  duplicate_returned = sorted(
    wikidata_id
    for wikidata_id, count in returned_counts.items()
    if count > 1
  )

  missing = sorted(
    set(requested_ids) - set(returned_counts)
  )

  unexpected = sorted(
    set(returned_counts) - set(requested_ids)
  )

  errors = []

  if duplicate_requested:
    errors.append(
      f"Duplicate requested IDs: {duplicate_requested}"
    )

  if duplicate_returned:
    errors.append(
      f"Duplicate returned IDs: {duplicate_returned}"
    )

  if missing:
    errors.append(
      f"Missing destinations: {missing}"
    )

  if unexpected:
    errors.append(
      f"Unexpected destinations: {unexpected}"
    )

  if expected_names is not None:
    for record in records:
      expected_name = expected_names.get(record.wikidata_id)

      if expected_name is None:
        errors.append(
          f"No expected name configured for "
          f"{record.wikidata_id}"
        )
        continue

      actual_name = record.name.strip().casefold()
      expected_name_normalized = expected_name.strip().casefold()

      if actual_name != expected_name_normalized:
        errors.append(
          f"Destination name mismatch for "
          f"{record.wikidata_id}: "
          f"expected '{expected_name}', "
          f"received '{record.name}'"
        )

  if errors:
    raise DestinationBatchValidationError(
      "; ".join(errors)
    )

  return records