// Import images
import pussiImage from "../assets/images/slides/slide1/pussi.png";
import dogImage from "../assets/images/slides/slide1/dog.png";
import epLabImage from "../assets/images/slides/slide1/eplab.png";
import finlandImage from "../assets/images/slides/slide1/finland.png";
import firstSteps from "../assets/images/slides/slide2/firststeps.png";
import palmsImage from "../assets/images/slides/slide2/palms.png";
import hiveImage from "../assets/images/slides/slide2/hive.png";
import moneyImage from "../assets/images/slides/slide2/money.png";
import swimImage from "../assets/images/slides/slide3/swimming.png";
import clangImage from "../assets/images/slides/slide3/clang.png";
import hiveCluster from "../assets/images/slides/slide4/hivecluster.png";
import flowImage from "../assets/images/slides/slide4/flow.png";
import fdfImage from "../assets/images/slides/slide4/fdf.png";
import holyGraph from "../assets/images/slides/slide4/holygraph.png";
import jobImage from "../assets/images/slides/slide5/job.png";
import tietoEvry from "../assets/images/slides/slide5/tieto.png";
import podiumImage from "../assets/images/slides/slide5/podium.png";
import gamesGlobal from "../assets/images/slides/slide5/gamesglobal.png";
import environmentsImage from "../assets/images/slides/slide6/environments.png";
import designImage from "../assets/images/slides/slide6/design.png";
import tddImage from "../assets/images/slides/slide6/tdd.png";
import pairingImage from "../assets/images/slides/slide6/pairing.png";
import pseudocodeImage from "../assets/images/slides/slide7/pseudocode.png";
import peerToPeer from "../assets/images/slides/slide7/peertopeer.png";
import testImage from "../assets/images/slides/slide7/test.png";
import gitImage from "../assets/images/slides/slide7/git.png";
import expectation from "../assets/images/slides/slide8/expectation.png";
import tgBotImage from "../assets/images/slides/slide8/tgbot.png";
import newdogImage from "../assets/images/slides/slide8/newdog.png";
import cherrypicko from "../assets/images/slides/slide8/cherry.png";
// Setup slide content and containers
function setupSlides(planets, exitPlanetViewCallback, showSlideCallback) {
  createSlideContainers(exitPlanetViewCallback, showSlideCallback);
}

// Create HTML containers for slides
function createSlideContainers(exitPlanetViewCallback, showSlideCallback) {
  // Create main slide container
  const container = document.createElement("div");
  container.id = "slideContainer";
  document.body.appendChild(container);

  // Create a "back to space" button
  const backButton = document.createElement("button");
  backButton.textContent = "Back to Space";
  backButton.id = "backButton";
  backButton.addEventListener("click", exitPlanetViewCallback);
  document.body.appendChild(backButton);

  // Create individual slide divs
  for (let i = 0; i < 8; i++) {
    const slide = document.createElement("div");
    slide.id = `slide-${i}`;
    slide.className = "slide";

    // Slide title
    const title = document.createElement("h2");
    title.textContent = getSlideTitle(i);
    slide.appendChild(title);

    // Create content based on slide number
    const content = document.createElement("div");
    // content.innerHTML = getSlideContent(i);
    slide.appendChild(content);

    // Create image gallery
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    // Image descriptions based on slide content
    const imageDescriptions = getImageDescriptions(i);

    // Get real image sources if available
    const imageSources = getSlideImageSources(i);

    // Add images with descriptions
    for (let j = 0; j < imageDescriptions.length; j++) {
      const imgContainer = document.createElement("div");
      imgContainer.className = "image-wrapper";

      // Image placeholder or real image
      let img;

      if (imageSources[j]) {
        // Use real image
        img = document.createElement("img");
        img.className = "real-image";
        img.src = imageSources[j];
        img.alt = imageDescriptions[j];
      } else {
        // Use placeholder
        img = document.createElement("div");
        img.className = "image-placeholder";
        img.style.backgroundColor = `hsl(${(i * 50 + j * 30) % 360}, 70%, 50%)`;

        const imgText = document.createElement("span");
        imgText.textContent = `Image ${j + 1}`;
        img.appendChild(imgText);
      }

      // Image description
      const description = document.createElement("div");
      description.className = "image-description";
      description.textContent = imageDescriptions[j];

      imgContainer.appendChild(img);
      imgContainer.appendChild(description);
      imageContainer.appendChild(imgContainer);
    }

    slide.appendChild(imageContainer);
    container.appendChild(slide);
  }
}

// Get slide title based on index
function getSlideTitle(index) {
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
function getSlideContent(index) {
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

// Get real images for slides
function getSlideImageSources(index) {
  const imageSources = [
    // Background - Slide 1
    [pussiImage, dogImage, epLabImage, finlandImage],
    // Motivation - Slide 2
    [firstSteps, hiveImage, moneyImage, palmsImage],
    // Bootcamp - Slide 3
    [swimImage, clangImage],
    // Education - Slide 4
    [hiveCluster, flowImage, fdfImage, holyGraph],
    // Job Search - Slide 5
    [jobImage, tietoEvry, podiumImage, gamesGlobal],
    // Engineering Practices - Slide 6
    [environmentsImage, designImage, tddImage, pairingImage],
    // Advice - Slide 7
    [peerToPeer, pseudocodeImage, testImage, gitImage],
    // Conclusions - Slide 8
    [expectation, cherrypicko, newdogImage],
  ];
  return imageSources[index];
}

// Get image descriptions based on slide index
function getImageDescriptions(index) {
  const descriptions = [
    // Background
    [
      "Home, sweet home",
      "First programming projects in Java and C++",
      "Medical engineering workplace",
      "Finland's tech landscape",
    ],
    // Motivation
    [
      "JavaScript first steps",
      "Hive Helsinki campus",
      "100 k per minute",
      "Remote work",
    ],
    // Bootcamp
    ["Bootcamp collaborative environment", "C programming exercises"],
    // Education at Hive
    [
      "Hive campus",
      "Flow state coding session",
      "Graphics branch project",
      "Holy graph",
    ],
    // Job Search
    [
      "First job searching attempts",
      "Tietoevry company headquarters",
      "Small family firm",
      "Games Global",
    ],
    // Engineering Practices
    [
      "Development environment setup",
      "Feature design documentation",
      "Test Driven Development",
      "Pair programming",
    ],
    // Advice
    [
      "Peer to peer learning advantages",
      "Pseudocode before coding",
      "Testing, testing, testing",
      "Master Git",
    ],
    // Conclusions
    [
      "Expectations vs reality",
      "AI media content chat interface",
      "I know what I am doing!",
    ],
  ];
  return descriptions[index];
}

export {
  setupSlides,
  getSlideTitle,
  getSlideContent,
  getImageDescriptions,
  getSlideImageSources,
};
