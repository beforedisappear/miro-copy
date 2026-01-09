export type SelectionModifier = 'replace' | 'add' | 'toggle';
export type Selection = Set<string>;

export function selectItems(
  initialSelectedIds: Selection,
  ids: string[],
  modifier: SelectionModifier = 'replace',
): Selection {
  if (modifier === 'replace') {
    return new Set(ids);
  }

  if (modifier === 'add') {
    return new Set([...initialSelectedIds, ...ids]);
  }

  if (modifier === 'toggle') {
    const currentIds = new Set(initialSelectedIds);

    const newIds = new Set(ids);

    const base = Array.from(initialSelectedIds).filter(id => !newIds.has(id));
    const added = ids.filter(id => !currentIds.has(id));

    return new Set([...base, ...added]);
  }

  return initialSelectedIds;
}
