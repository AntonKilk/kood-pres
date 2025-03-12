// Get slide title based on index
export function getSlideTitle(index) {
  const titles = [
    "Background",
    "Motivation to Become a Programmer",
    "Bootcamp Experience",
    "Education at Hive",
    "Job Search",
    "Current Work and Engineering Practices",
    "Advice for Aspiring Programmers",
    "Conclusions",
  ];
  return titles[index];
}

// Get slide content based on index
export function getSlideContent(index) {
  const contents = [
    `<ul>
            <li>Born and raised in Püssi, Estonia</li>
            <li>Studied electronics at university</li>
            <li>First exposure to programming: Java, C++, bash scripting</li>
            <li>Initially found programming difficult</li>
            <li>Completed master's degree</li>
            <li>Worked as a medical engineer for 10 years</li>
            <li>Moved to Finland with family</li>
        </ul>`,

    `<ul>
            <li>Wanted a career change after 35</li>
            <li>Started with learning JavaScript in spare time</li>
            <li>Discovered Hive Helsinki (School 42 affiliate)</li>
            <li>Main motivation: ability to work remotely</li>
            <li>Other expectations:</li>
            <ul>
                <li>Working from tropical locations</li>
                <li>Being part of a large community</li>
                <li>Career growth opportunities</li>
                <li>Higher salary</li>
            </ul>
        </ul>`,

    `<ul>
            <li>Took 4 weeks off work for the selection process</li>
            <li>Learned C programming fundamentals</li>
            <li>Gained console skills</li>
            <li>Was accepted and became a full-time student</li>
            <li>Quit previous job to focus on studies</li>
        </ul>`,

    `<ul>
            <li>Challenging to study after 35 with family and two children</li>
            <li>Completed the program in 1 year and 3 months</li>
            <li>Project-based learning with gamification elements</li>
            <li>Peer review system for projects</li>
            <li>Four specialization paths: web, graphics, algorithms, computer programs</li>
            <li>Chose algorithms path (regretted not choosing web or graphics)</li>
            <li>Found coding immersive - entered "flow state" often</li>
        </ul>`,

    `<ul>
            <li>First attempts were unsuccessful</li>
            <li>Started applying after 6 months of study</li>
            <li>Got some interviews but failed technical assignments</li>
            <li>Lacked practical knowledge in commercial technologies</li>
            <li>First job came after one year of study</li>
            <li>Hired at Tietoevry (largest outsourcing firm in Finland) as junior developer</li>
            <li>Project was canceled, but gained valuable experience in C# and Azure</li>
            <li>Found second job through employment office at a small family firm</li>
            <li>Worked on a medical CRM system for 6 months</li>
        </ul>`,

    `<ul>
            <li>Now works at a company with solid engineering practices:</li>
            <ul>
                <li>Multiple environments (development, test, production)</li>
                <li>Automated tests</li>
                <li>QA assistance</li>
                <li>Self-written tests for each feature</li>
                <li>GitLab workflow with code reviews</li>
                <li>Design documentation for features</li>
                <li>Daily team meetings</li>
                <li>Bi-weekly project demos</li>
            </ul>
            <li>Recent project: dynamic form rendering (took 2 months)</li>
        </ul>`,

    `<ul>
            <li>Practice code reviews and effective communication</li>
            <li>Learn thorough testing</li>
            <li>Master Git</li>
            <li>Design before coding: sketch, pseudocode</li>
            <li>Communicate with colleagues</li>
            <li>Show independence in problem-solving but ask questions</li>
            <li>Look for team leads who were former engineers/QA</li>
            <li>Be cautious of managers who don't understand the product</li>
        </ul>`,

    `<ul>
            <li>Has been working as a programmer for 2.5 years</li>
            <li>Enjoys seeing results of his work</li>
            <li>Appreciates the problem-solving aspects</li>
            <li>Works on side projects (Telegram job search bot, AI media content chat)</li>
            <li>Constantly learning new technologies</li>
            <li>Reality check:</li>
            <ul>
                <li>Remote work expectations not met</li>
                <li>No tropical locations</li>
                <li>Satisfied with salary</li>
                <li>Not worried about AI taking his job</li>
            </ul>
        </ul>`,
  ];
  return contents[index];
}

// Get image descriptions based on slide index
export function getImageDescriptions(index) {
  const descriptions = [
    // Background
    [
      "University campus where programming journey began",
      "First programming projects in Java and C++",
      "Medical engineering workplace",
      "Finland's tech landscape",
    ],
    // Motivation
    [
      "Remote work visualization",
      "JavaScript learning resources",
      "Hive Helsinki campus",
      "Career transition planning",
    ],
    // Bootcamp
    [
      "Bootcamp collaborative environment",
      "C programming exercises",
      "Command line interface mastery",
      "Bootcamp celebration",
    ],
    // Education at Hive
    [
      "Project-based learning approach",
      "Peer review sessions",
      "Different specialization paths diagram",
      "Flow state coding session",
    ],
    // Job Search
    [
      "First job application process",
      "Technical interview preparation",
      "Tietoevry company headquarters",
      "Medical CRM project visualization",
    ],
    // Engineering Practices
    [
      "Development environment setup",
      "Automated testing workflow",
      "GitLab code review process",
      "Dynamic form rendering project",
    ],
    // Advice
    [
      "Code review best practices",
      "Testing methodology diagram",
      "Git branching strategy",
      "Team communication structure",
    ],
    // Conclusions
    [
      "Career progress timeline",
      "Telegram bot project screenshot",
      "AI media content chat interface",
      "Work-life balance reality",
    ],
  ];
  return descriptions[index];
}
