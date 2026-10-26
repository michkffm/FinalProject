export const emptyJobFilters = { name: "", category: "", location: "", price: "all", sort: "newest" };

export function filterJobs(jobs, filters) {
  const filtered = jobs.filter((job) => {
    const amount = Number(job.price);
    const matchesPrice = filters.price === "all" ||
      (filters.price === "low" && amount < 50) ||
      (filters.price === "medium" && amount >= 50 && amount <= 100) ||
      (filters.price === "high" && amount > 100);
    return matchesPrice && (!filters.category || job.category === filters.category) &&
      job.title.toLowerCase().includes(filters.name.trim().toLowerCase()) &&
      job.location.toLowerCase().includes(filters.location.trim().toLowerCase());
  });
  if (filters.sort === "price-asc") {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (filters.sort === "price-desc") {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (filters.sort === "newest") {
    const createdAt = job => Date.parse(job.createdAt) || 0;
    filtered.sort((a, b) => createdAt(b) - createdAt(a));
  }
  return filtered;
}
