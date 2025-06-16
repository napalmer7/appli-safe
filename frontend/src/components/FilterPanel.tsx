export default function FilterPanel({ ageGroup, setAgeGroup, tag, setTag }: any) {
  return (
    <div className="mb-4">
      <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)}>
        <option value="">All Ages</option>
        <option value="2-4">2–4</option>
        <option value="5-7">5–7</option>
        <option value="8-12">8–12</option>
        <option value="13-15">13–15</option>
        <option value="16-18">16–18</option>
      </select>
      <input
        type="text"
        placeholder="Filter by tag"
        value={tag}
        onChange={e => setTag(e.target.value)}
        className="ml-2"
      />
    </div>
  );
}