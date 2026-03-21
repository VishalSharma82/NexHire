import OpenAI from 'openai';

const mockResponses = {
  react: [
    "### React Fundamentals\n\nReact is a **declarative, component-based** library for building UIs. Here are key concepts:\n\n* **JSX**: Syntax sugar for `React.createElement`.\n* **Components**: Independent, reusable pieces of UI.\n* **Props**: How we pass data between components.\n\n```javascript\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n```",
    "### The Virtual DOM\n\nThe **Virtual DOM** is a programming concept where an 'ideal', or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM.\n\n> **Note**: This process is called **reconciliation**.",
    "### React Hooks\n\nHooks let you use state and other React features without writing a class. Some common hooks:\n\n1. `useState`: Track state in functional components.\n2. `useEffect`: Handle side effects (API calls, subscriptions).\n3. `useContext`: Access React Context.\n\n```javascript\nconst [count, setCount] = useState(0);\n```",
    "### State vs Props\n\n| Feature | Props | State |\n| :--- | :--- | :--- |\n| Read-only | Yes | No (Mutable) |\n| Ownership | Parent | Component itself |\n| Triggers re-render | Yes | Yes |"
  ],
  dsa: [
    "### Linked Lists\n\nA **Linked List** consists of nodes where each node contains data and a reference to the next node.\n\n* **Pros**: Dynamic size, easy insertion/deletion.\n* **Cons**: No random access, extra memory for pointers.\n\n```python\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n```",
    "### Binary Search\n\nBinary search find the position of a target value within a **sorted** array.\n\n**Time Complexity**: $O(\\log n)$\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```"
  ],
  default: [
    "### Welcome to AI Interview Coach!\n\nI'm here to help you get that dream job. You can ask me about:\n\n*   **Technical concepts** (React, JS, CSS)\n*   **Algorithms** (DSA basics)\n*   **System Design**\n*   **HR Tips**\n\nWhat would you like to focus on today?"
  ]
};

export const getAIResponse = async (input, config = {}) => {
  // Priority: 1. .env key (System), 2. Manual config key (Legacy)
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || config.apiKey || "";
  const { 
    category = "frontend", 
    mode = "coach", 
    resume = "", 
    persona = "supportive" 
  } = config;

  if (!apiKey) {

    // Fallback to Mock Responses
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lowerInput = input.toLowerCase();
    let categoryKey = "default";

    if (category === "frontend" || lowerInput.includes("react") || lowerInput.includes("js") || lowerInput.includes("css")) {
      categoryKey = "react";
    } else if (category === "dsa" || lowerInput.includes("algorithm") || lowerInput.includes("data structure")) {
      categoryKey = "dsa";
    }

    const categoryResponses = mockResponses[categoryKey] || mockResponses.default;
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);
    return `> **[MOCK MODE ACTIVE]** Bhai, real AI response ke liye API Key zaruri hai. Tab tak ye demo dekho:\n\n${categoryResponses[randomIndex]}`;
  }

  // Real OpenAI Call
  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
      timeout: 30000 // 30 seconds timeout for long stories
    });

    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const systemPrompt = mode === 'normal' 
      ? `You are NexHire AI, a helpful and professional general-purpose assistant. 
         CURRENT DATE: ${currentDate}
         Provide insightful, accurate, and concise answers to any user query. 
         Maintain a professional but friendly tone. 
         You have access to current ongoing events—answer based on your knowledge base while respecting the current date.`
      : `
      You are an expert AI Interview Coach and Professional Analyst (NexHire Elite).
      CURRENT DATE: ${currentDate}
      Current Mode: ${mode}
      Specialty: ${category || 'General Software Engineering'}
      Persona: ${persona}
      
      ${resume ? `Candidate Resume Context: ${resume.substring(0, 2000)}` : "No resume provided yet."}

      INSTRUCTIONS:
      1. If you provide code solutions, wrap them in :::code-sync blocks.
      2. If the user asks for an interview based on their resume, START the interview immediately.
      3. Focus on real-world industry patterns, not just academic ones.
      4. Avoid being strictly frontend-focused unless explicitly asked or implied by the resume/category.
      Requirements:
      1. Use Markdown for all formatting.
      2. If the user shares a long story or project history, ANALYZE it professionally. 
      3. Identify their skills, roles, and potential value based on their narrative.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error(error.message || "Failed to get AI response");
  }
};
