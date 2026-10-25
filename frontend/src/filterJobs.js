export function filterJobs(jobs, filters) {
  return jobs.filter((job) => {
    const amount = Number(job.price);
    const matchesPrice = filters.price === "all" ||
      (filters.price === "low" && amount < 50) ||
      (filters.price === "medium" && amount >= 50 && amount <= 100) ||
      (filters.price === "high" && amount > 100);
    return matchesPrice && job.title.toLowerCase().includes(filters.name.toLowerCase()) &&
      job.location.toLowerCase().includes(filters.location.toLowerCase());
  });
}
