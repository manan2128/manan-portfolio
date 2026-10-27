export const profile = {
  name: "Manan Agarwal",
  university: "JECRC University",
  course: "BTech in Computer Science and Engineering",
  year: "Second year",
  email: "agarwal21manan@gmail.com",
  github: "https://github.com/manan2128",
  introduction: "A second-year Computer Science and Engineering student at JECRC University, learning through programming exercises, web applications, and prompt engineering.",
  learning: ["Python", "HTML", "CSS", "JavaScript", "Git & GitHub", "Prompt engineering"]
};
export const projects = [
  {
    id: "python", number: "01", title: "Python Programs Collection",
    category: "Python", kind: "Programming fundamentals",
    description: "Three small exercises exploring factorials, Fibonacci sequences, and student records represented as Python dictionaries.",
    technologies: ["Python"],
    links: [
      {label:"Factorial",url:"https://github.com/manan2128/python-basics-factorial"},
      {label:"Fibonacci",url:"https://github.com/manan2128/python-basics-fibonacci"},
      {label:"Dictionary",url:"https://github.com/manan2128/python-basics-struct-to-dict"}
    ],
    detail: "The factorial example multiplies integers from 1 through 5 to produce 120. The Fibonacci exercise generates ten terms iteratively. The dictionary exercise stores and displays a sample student's name, roll number, and marks. The current dictionary code constructs a dictionary directly; it does not implement a general struct converter.",
    provenance: "Existing coursework repositories; original commit history is preserved."
  },
  {
    id: "refactor", number: "02", title: "Messy Python Code Improvement",
    category: "Python", kind: "Readable code",
    description: "A student-marks reporting exercise organized around reusable functions for totals, averages, and class comparisons.",
    technologies: ["Python", "Refactoring"],
    links: [{label:"View repository",url:"https://github.com/manan2128/Messy-Python-code"}],
    detail: "Functions sum_scores, average_score, and count_above_avg process five sample student records. The script calculates totals, grades, class average, number above average, and the topper. Each record has three subject marks. This is an existing shared coursework repository, not a newly authored project.",
    provenance: "Existing shared coursework; source attribution is retained in the repository."
  },
  {
    id: "debug", number: "03", title: "Bug Fixing with Python",
    category: "Python", kind: "Debugging & testing",
    description: "A focused debugging exercise covering average calculation, the passing boundary, and grade-condition ordering.",
    technologies: ["Python", "unittest"],
    links: [{label:"View repository",url:"https://github.com/manan2128/Buggy-python"}],
    detail: "The documented fixes use len(marks) as the average denominator, include 40 as a passing mark with >=, and check distinction (90) before first grade (60). The repository includes nine unit tests plus recorded before/after outputs. Empty marks are not handled by the current implementation.",
    provenance: "Existing coursework repository; its contributor history is preserved."
  },
  {
    id: "quiz", number: "04", title: "Interactive Quiz Application",
    category: "Web", kind: "Interactive learning",
    description: "A five-question programming quiz that checks each answer, advances through the questions, and calculates a final score.",
    technologies: ["HTML", "CSS", "JavaScript"],
    links: [{label:"View repository",url:"https://github.com/manan2128/Queez"}],
    live: null,
    detail: "Questions and answer choices are stored in a JavaScript array. Clicking an answer checks correctness, updates the score, and advances to the next question. The final screen displays the score. This existing shared project retains its original author credit.",
    provenance: "Existing shared coursework; the original author is credited in the README."
  },
  {
    id: "books", number: "05", title: "Book Reading List",
    category: "Web", kind: "Everyday organization",
    description: "A personal bookshelf for adding titles, changing reading status, and filtering books as a reading list grows.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    links: [{label:"View repository",url:"https://github.com/manan2128/ReadingBook_app"}],
    live: null,
    detail: "React state manages book records. Books are saved in browser localStorage under reading-list-books. Each book has an ID, title, and status: want, reading, or finished. Users can add, remove, filter, and cycle status. Duplicate titles are rejected. Data stays in that browser and does not sync between devices.",
    provenance: "Existing shared coursework; the source repository retains its history."
  }
];
export function filterProjects(items, query = "", category = "All") {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(project => {
    const text = [project.title, project.kind, project.description, ...project.technologies].join(" ").toLowerCase();
    return (category === "All" || project.category === category) && terms.every(term => text.includes(term));
  });
}

