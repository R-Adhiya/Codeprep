const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Standard MySQL Pool
const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CodePrep',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let isMysqlOnline = false;

// Verified bcrypt hashes for 'admin123' and 'user123'
const HASH_ADMIN123 = '$2a$10$Book0iA3X13rGp122imM/efBPF4FFeHVhZqDkrBZc2ymRx1xaEk9m';
const HASH_USER123  = '$2a$10$RthjoohUiV2qIsslPhCwFOBXLT8GjIe/hOTXP4EDkU0y7ErfBYuU6';

// In-Memory Data Store (Provides seamless fallback when MySQL is stopped on host)
const memoryStore = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@codeprep.com', password: HASH_ADMIN123, role: 'ADMIN', streak_count: 7, last_active: new Date(), created_at: new Date() },
    { id: 2, name: 'Student User', email: 'user@codeprep.com', password: HASH_USER123, role: 'USER', streak_count: 5, last_active: new Date(), created_at: new Date() }
  ],
  coding_questions: [
    { id: 1, title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', difficulty: 'Easy', category: 'Arrays', sample_input: 'nums = [2,7,11,15], target = 9', sample_output: '[0,1]', solution: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}', created_at: new Date() },
    { id: 2, title: 'Reverse a String', description: 'Write a function that reverses a string. The input string is given as an array of characters.', difficulty: 'Easy', category: 'Strings', sample_input: '["h","e","l","l","o"]', sample_output: '["o","l","l","e","h"]', solution: 'function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++; right--;\n  }\n  return s;\n}', created_at: new Date() },
    { id: 3, title: 'Binary Search', description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.', difficulty: 'Easy', category: 'Searching', sample_input: 'nums = [-1,0,3,5,9,12], target = 9', sample_output: '4', solution: 'function binarySearch(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}', created_at: new Date() },
    { id: 4, title: 'Merge Sort', description: 'Implement Merge Sort to sort an array of numbers in ascending order.', difficulty: 'Medium', category: 'Sorting', sample_input: 'nums = [5,2,3,1]', sample_output: '[1,2,3,5]', solution: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(left, right) {\n  let res = [], i = 0, j = 0;\n  while(i < left.length && j < right.length) {\n    if (left[i] < right[j]) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  return res.concat(left.slice(i)).concat(right.slice(j));\n}', created_at: new Date() },
    { id: 5, title: 'Valid Parentheses', description: 'Given a string containing just brackets, determine if the input string is valid.', difficulty: 'Easy', category: 'Data Structures', sample_input: 's = "()[]{}"', sample_output: 'true', solution: 'function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  for (let char of s) {\n    if (["(", "{", "["].includes(char)) stack.push(char);\n    else if (stack.pop() !== map[char]) return false;\n  }\n  return stack.length === 0;\n}', created_at: new Date() },
    { id: 6, title: 'Maximum Subarray Sum', description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', difficulty: 'Medium', category: 'Algorithms', sample_input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', sample_output: '6', solution: 'function maxSubArray(nums) {\n  let maxSum = nums[0], currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}', created_at: new Date() },
    { id: 7, title: 'Detect Loop in Linked List', description: 'Given head of a linked list, determine if the linked list has a cycle in it.', difficulty: 'Medium', category: 'Data Structures', sample_input: 'head = [3,2,0,-4], pos = 1', sample_output: 'true', solution: 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}', created_at: new Date() },
    { id: 8, title: 'Palindrome Check', description: 'Determine whether an integer or string reads the same backward as forward.', difficulty: 'Easy', category: 'Strings', sample_input: 's = "racecar"', sample_output: 'true', solution: 'function isPalindrome(s) {\n  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return cleaned === cleaned.split("").reverse().join("");\n}', created_at: new Date() },
    { id: 9, title: 'Find Missing Number', description: 'Given an array nums containing n distinct numbers in range [0, n], return the number missing.', difficulty: 'Easy', category: 'Arrays', sample_input: 'nums = [3,0,1]', sample_output: '2', solution: 'function missingNumber(nums) {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);\n  return expectedSum - actualSum;\n}', created_at: new Date() },
    { id: 10, title: 'Longest Substring Without Repeating Characters', description: 'Find the length of the longest substring without repeating characters.', difficulty: 'Hard', category: 'Strings', sample_input: 's = "abcabcbb"', sample_output: '3', solution: 'function lengthOfLongestSubstring(s) {\n  let set = new Set(), maxLen = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}', created_at: new Date() },
    { id: 11, title: 'Climbing Stairs', description: 'You are climbing a staircase. It takes n steps to reach the top. How many distinct ways can you climb to the top?', difficulty: 'Easy', category: 'Algorithms', sample_input: 'n = 3', sample_output: '3', solution: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  let first = 1, second = 2;\n  for (let i = 3; i <= n; i++) {\n    let third = first + second;\n    first = second;\n    second = third;\n  }\n  return second;\n}', created_at: new Date() },
    { id: 12, title: 'Container With Most Water', description: 'Given n non-negative integers height, find two lines that together with x-axis form a container holding most water.', difficulty: 'Medium', category: 'Arrays', sample_input: 'height = [1,8,6,2,5,4,8,3,7]', sample_output: '49', solution: 'function maxArea(height) {\n  let left = 0, right = height.length - 1, max = 0;\n  while (left < right) {\n    let area = Math.min(height[left], height[right]) * (right - left);\n    max = Math.max(max, area);\n    if (height[left] < height[right]) left++; else right--;\n  }\n  return max;\n}', created_at: new Date() },
    { id: 13, title: 'Implement Queue using Stacks', description: 'Implement a first in first out (FIFO) queue using only two stacks.', difficulty: 'Easy', category: 'Data Structures', sample_input: 'push(1), push(2), pop()', sample_output: '1', solution: 'class MyQueue {\n  constructor() { this.s1 = []; this.s2 = []; }\n  push(x) { this.s1.push(x); }\n  pop() {\n    if (!this.s2.length) while(this.s1.length) this.s2.push(this.s1.pop());\n    return this.s2.pop();\n  }\n}', created_at: new Date() },
    { id: 14, title: 'Lowest Common Ancestor in BST', description: 'Given a Binary Search Tree and two nodes, find their lowest common ancestor (LCA).', difficulty: 'Medium', category: 'Data Structures', sample_input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', sample_output: '6', solution: 'function lowestCommonAncestor(root, p, q) {\n  while (root) {\n    if (p.val < root.val && q.val < root.val) root = root.left;\n    else if (p.val > root.val && q.val > root.val) root = root.right;\n    else return root;\n  }\n}', created_at: new Date() },
    { id: 15, title: 'Group Anagrams', description: 'Given an array of strings, group the anagrams together.', difficulty: 'Medium', category: 'Strings', sample_input: 'strs = ["eat","tea","tan","ate","nat","bat"]', sample_output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', solution: 'function groupAnagrams(strs) {\n  const map = {};\n  for (let s of strs) {\n    const key = s.split("").sort().join("");\n    if (!map[key]) map[key] = [];\n    map[key].push(s);\n  }\n  return Object.values(map);\n}', created_at: new Date() },
    { id: 16, title: 'Top K Frequent Elements', description: 'Given an integer array nums and an integer k, return the k most frequent elements.', difficulty: 'Medium', category: 'Sorting', sample_input: 'nums = [1,1,1,2,2,3], k = 2', sample_output: '[1,2]', solution: 'function topKFrequent(nums, k) {\n  const map = {};\n  nums.forEach(n => map[n] = (map[n] || 0) + 1);\n  return Object.keys(map).sort((a,b) => map[b] - map[a]).slice(0, k).map(Number);\n}', created_at: new Date() },
    { id: 17, title: 'Trapping Rain Water', description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.', difficulty: 'Hard', category: 'Algorithms', sample_input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', sample_output: '6', solution: 'function trap(height) {\n  let left = 0, right = height.length - 1, maxL = 0, maxR = 0, res = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= maxL) maxL = height[left];\n      else res += maxL - height[left];\n      left++;\n    } else {\n      if (height[right] >= maxR) maxR = height[right];\n      else res += maxR - height[right];\n      right--;\n    }\n  }\n  return res;\n}', created_at: new Date() },
    { id: 18, title: 'Kth Largest Element in an Array', description: 'Find the kth largest element in an unsorted array.', difficulty: 'Medium', category: 'Searching', sample_input: 'nums = [3,2,1,5,6,4], k = 2', sample_output: '5', solution: 'function findKthLargest(nums, k) {\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}', created_at: new Date() },
    { id: 19, title: 'Number of Islands', description: 'Given an m x n 2D binary grid, count the number of islands.', difficulty: 'Medium', category: 'Algorithms', sample_input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', sample_output: '2', solution: 'function numIslands(grid) {\n  if (!grid.length) return 0;\n  let count = 0;\n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[0].length; c++) {\n      if (grid[r][c] === "1") {\n        count++;\n        dfs(grid, r, c);\n      }\n    }\n  }\n  return count;\n}\nfunction dfs(grid, r, c) {\n  if (r<0||c<0||r>=grid.length||c>=grid[0].length||grid[r][c]==="0") return;\n  grid[r][c] = "0";\n  dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);\n}', created_at: new Date() },
    { id: 20, title: 'Coin Change', description: 'Given coins of different denominations and total amount, compute fewest number of coins to make up that amount.', difficulty: 'Medium', category: 'Algorithms', sample_input: 'coins = [1,2,5], amount = 11', sample_output: '3', solution: 'function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (let coin of coins) {\n      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}', created_at: new Date() }
  ],
  interview_questions: [
    { id: 1, question: 'What is the difference between a process and a thread?', answer: 'A process is an independent executing program with its own memory space allocated by the OS. A thread is a lightweight execution path within a process. Threads of the same process share memory space and resources.', category: 'Technical', difficulty: 'Easy', created_at: new Date() },
    { id: 2, question: 'Explain the four primary principles of Object-Oriented Programming (OOP).', answer: '1. Encapsulation: Bundling data and methods operating on that data into a single unit.\n2. Abstraction: Hiding internal complexity and showing only necessary features.\n3. Inheritance: Mechanism to create new classes based on existing ones.\n4. Polymorphism: Ability to present the same interface for different underlying forms.', category: 'Technical', difficulty: 'Easy', created_at: new Date() },
    { id: 3, question: 'What is the difference between Primary Key and Foreign Key in DBMS?', answer: 'A Primary Key uniquely identifies a record in a table and cannot contain NULL values. A Foreign Key is a field in one table that references the Primary Key of another table, establishing a relationship between them.', category: 'Technical', difficulty: 'Easy', created_at: new Date() },
    { id: 4, question: 'How does asynchronous programming work in JavaScript (Event Loop)?', answer: 'JavaScript is single-threaded. Async operations are handled via Web APIs/Node APIs, callback queues, microtask queues (promises), and the Event Loop, which continuously pushes tasks from queues to the call stack once it is empty.', category: 'Technical', difficulty: 'Medium', created_at: new Date() },
    { id: 5, question: 'What is the difference between REST API and GraphQL?', answer: 'REST APIs expose specific endpoints for specific resources. GraphQL allows clients to request exactly the data fields they need using a single endpoint.', category: 'Technical', difficulty: 'Medium', created_at: new Date() },
    { id: 6, question: 'Explain Database Indexing and how it improves query performance.', answer: 'Database indexing is a data structure technique (e.g., B-Trees) that speeds up data retrieval operations on a table at the cost of additional write time and storage space.', category: 'Technical', difficulty: 'Medium', created_at: new Date() },
    { id: 7, question: 'What is the difference between Stack and Queue data structures?', answer: 'A Stack follows LIFO (Last In First Out) principles (e.g., call stack, undo operation). A Queue follows FIFO (First In First Out) principles (e.g., task scheduling, printing jobs).', category: 'Technical', difficulty: 'Easy', created_at: new Date() },
    { id: 8, question: 'What are ACID properties in Database Management Systems?', answer: 'ACID stands for:\n- Atomicity: Transactions are all-or-nothing.\n- Consistency: Database moves from one valid state to another.\n- Isolation: Concurrent transactions executed independently.\n- Durability: Committed transactions persist permanently.', category: 'Technical', difficulty: 'Medium', created_at: new Date() },
    { id: 9, question: 'What is Big O Notation and why is it important?', answer: 'Big O notation describes the upper bound performance or execution time of an algorithm in terms of input size (N). It helps compare efficiency in worst-case scenarios for time and space complexity.', category: 'Technical', difficulty: 'Easy', created_at: new Date() },
    { id: 10, question: 'Tell me about yourself.', answer: 'Structure your answer using Present, Past, and Future frame:\n1. Present: Current status/education and skills.\n2. Past: Relevant projects or experiences.\n3. Future: Why this role/platform aligns with your career goals.', category: 'HR', difficulty: 'Easy', created_at: new Date() },
    { id: 11, question: 'What are your greatest strengths and weaknesses?', answer: 'Strength: Provide a job-relevant skill with a quick real example (e.g., problem-solving, adaptability).\nWeakness: Share a genuine area of improvement, and explain active steps you take to address it.', category: 'HR', difficulty: 'Easy', created_at: new Date() },
    { id: 12, question: 'Why do you want to join our organization?', answer: 'Show research about the company, mention specific products/culture that excite you, and connect them with your passion for growth and contributing value.', category: 'HR', difficulty: 'Easy', created_at: new Date() },
    { id: 13, question: 'Where do you see yourself in five years?', answer: 'Demonstrate ambition and realistic growth. Mention mastering technical domain knowledge, taking leadership responsibilities, and adding value to projects.', category: 'HR', difficulty: 'Easy', created_at: new Date() },
    { id: 14, question: 'Describe a challenging project situation and how you handled it.', answer: 'Use the STAR method:\n- Situation: Context of the problem.\n- Task: What needed to be done.\n- Action: Steps YOU took to resolve it.\n- Result: Quantifiable or positive outcome achieved.', category: 'HR', difficulty: 'Medium', created_at: new Date() },
    { id: 15, question: 'Why should we hire you over other candidates?', answer: 'Highlight the combination of your technical foundation, problem-solving mindset, fast learning ability, and dedication to delivering quality solutions.', category: 'HR', difficulty: 'Easy', created_at: new Date() },
    { id: 16, question: 'What is the Virtual DOM in React and how does reconciliation work?', answer: 'Virtual DOM is a lightweight copy of real DOM in memory. When state changes, React compares Virtual DOM with previous state (diffing algorithm) and updates only changed elements in real DOM efficiently.', category: 'Technical', difficulty: 'Medium', created_at: new Date() },
    { id: 17, question: 'Explain Normalization vs Denormalization in SQL databases.', answer: 'Normalization reduces data redundancy by dividing tables and creating relationships (1NF, 2NF, 3NF). Denormalization intentionally adds redundant data to improve read query speed in data warehouses.', category: 'Technical', difficulty: 'Medium', created_at: new Date() },
    { id: 18, question: 'What is CORS (Cross-Origin Resource Sharing)?', answer: 'CORS is an HTTP-header based security mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.', category: 'Technical', difficulty: 'Easy', created_at: new Date() },
    { id: 19, question: 'Explain Deadlock conditions in Operating Systems.', answer: 'A deadlock occurs when processes are unable to proceed because each is waiting for resources held by another. Four Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.', category: 'Technical', difficulty: 'Hard', created_at: new Date() },
    { id: 20, question: 'What is the difference between SQL and NoSQL databases?', answer: 'SQL (Relational): Structured schemas, tables, ACID compliant, scales vertically (e.g. MySQL, PostgreSQL). NoSQL (Non-Relational): Dynamic schemas, JSON/key-value/document based, scales horizontally (e.g. MongoDB, Cassandra).', category: 'Technical', difficulty: 'Easy', created_at: new Date() },
    { id: 21, question: 'How do you handle conflict or disagreement within a project team?', answer: 'Listen actively to understand the root cause, focus on project goals rather than personal opinions, evaluate alternatives objectively with data, and find a collaborative compromise.', category: 'HR', difficulty: 'Medium', created_at: new Date() },
    { id: 22, question: 'What is your expected salary and career trajectory?', answer: 'State that you seek a competitive salary aligned with industry standards for your skill level, while prioritizing learning opportunities and technical growth.', category: 'HR', difficulty: 'Easy', created_at: new Date() }
  ],
  assessments: [
    { id: 1, title: 'Data Structures & Algorithms Basics', description: 'Test your fundamental knowledge of Arrays, Strings, Searching, and Basic Data Structures.', duration: 30, created_at: new Date() },
    { id: 2, title: 'Intermediate Problem Solving', description: 'Challenge your understanding of Sorting, Subarrays, Linked Lists, and Algorithm Optimization.', duration: 45, created_at: new Date() },
    { id: 3, title: 'Full Stack Technical Assessment', description: 'Comprehensive coding assessment evaluating algorithmic efficiency and problem-solving abilities.', duration: 60, created_at: new Date() },
    { id: 4, title: 'Advanced Algorithmic Challenge', description: 'Test advanced Dynamic Programming, Graphs, and Complex Data Structure optimization.', duration: 60, created_at: new Date() },
    { id: 5, title: 'SQL & Database Querying Exam', description: 'Evaluate your knowledge of relational database schema design, indexing, and complex queries.', duration: 40, created_at: new Date() },
    { id: 6, title: 'Frontend React & JS Architecture', description: 'Assess modern JavaScript ES6+, asynchronous programming, and React state management.', duration: 45, created_at: new Date() },
    { id: 7, title: 'OOP & System Design Fundamentals', description: 'Test Object-Oriented Principles, design patterns, clean code practices, and scalability.', duration: 35, created_at: new Date() }
  ],
  assessment_questions: [
    { id: 1, assessment_id: 1, question_id: 1 },
    { id: 2, assessment_id: 1, question_id: 2 },
    { id: 3, assessment_id: 1, question_id: 3 },
    { id: 4, assessment_id: 1, question_id: 5 },
    { id: 5, assessment_id: 2, question_id: 4 },
    { id: 6, assessment_id: 2, question_id: 6 },
    { id: 7, assessment_id: 2, question_id: 7 },
    { id: 8, assessment_id: 2, question_id: 9 },
    { id: 9, assessment_id: 3, question_id: 1 },
    { id: 10, assessment_id: 3, question_id: 4 },
    { id: 11, assessment_id: 3, question_id: 6 },
    { id: 12, assessment_id: 3, question_id: 7 },
    { id: 13, assessment_id: 3, question_id: 10 },
    { id: 14, assessment_id: 4, question_id: 17 },
    { id: 15, assessment_id: 4, question_id: 19 },
    { id: 16, assessment_id: 4, question_id: 20 },
    { id: 17, assessment_id: 5, question_id: 1 },
    { id: 18, assessment_id: 5, question_id: 9 },
    { id: 19, assessment_id: 5, question_id: 12 },
    { id: 20, assessment_id: 6, question_id: 2 },
    { id: 21, assessment_id: 6, question_id: 5 },
    { id: 22, assessment_id: 6, question_id: 8 },
    { id: 23, assessment_id: 6, question_id: 10 },
    { id: 24, assessment_id: 7, question_id: 3 },
    { id: 25, assessment_id: 7, question_id: 13 },
    { id: 26, assessment_id: 7, question_id: 14 }
  ],
  assessment_attempts: []
};

// Fallback Query Engine for in-memory database
const executeFallbackQuery = (sql, params = []) => {
  const sqlLower = sql.toLowerCase().trim();

  // 1. SELECT COUNT queries
  if (sqlLower.includes('select count(*) as count from users')) {
    return [[{ count: memoryStore.users.length }], []];
  }
  if (sqlLower.includes('select count(*) as count from coding_questions')) {
    return [[{ count: memoryStore.coding_questions.length }], []];
  }
  if (sqlLower.includes('select count(*) as count from interview_questions')) {
    return [[{ count: memoryStore.interview_questions.length }], []];
  }
  if (sqlLower.includes('select count(*) as count from assessments')) {
    return [[{ count: memoryStore.assessments.length }], []];
  }

  // 2. USERS Queries
  if (sqlLower.includes('select id from users where email = ?') || sqlLower.includes('select * from users where email = ?')) {
    const email = params[0]?.toLowerCase();
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email);
    return [user ? [user] : [], []];
  }
  if (sqlLower.includes('select id, name, email, role, created_at from users where id = ?')) {
    const id = params[0];
    const user = memoryStore.users.find(u => u.id == id);
    return [user ? [user] : [], []];
  }
  if (sqlLower.includes('insert into users')) {
    const newId = memoryStore.users.length + 1;
    const newUser = { id: newId, name: params[0], email: params[1], password: params[2], role: params[3] || 'USER', streak_count: 1, last_active: new Date(), created_at: new Date() };
    memoryStore.users.push(newUser);
    return [{ insertId: newId, affectedRows: 1 }, []];
  }

  // 3. USER STATS / ATTEMPTS
  if (sqlLower.includes('select count(*) as assessmentstaken')) {
    const userId = params[0];
    const user = memoryStore.users.find(u => u.id == userId) || { streak_count: 5 };
    const userAttempts = memoryStore.assessment_attempts.filter(a => a.user_id == userId);
    const count = userAttempts.length;
    let avg = 0, best = 0;
    if (count > 0) {
      const pcts = userAttempts.map(a => Math.round((a.score / a.total_questions) * 100));
      avg = pcts.reduce((sum, p) => sum + p, 0) / count;
      best = Math.max(...pcts);
    }
    return [[{ assessmentsTaken: count, averageScore: avg, bestScore: best, streakCount: user.streak_count || 5 }], []];
  }

  // 4. CODING QUESTIONS
  if (sqlLower.includes('from coding_questions')) {
    if (sqlLower.includes('where id = ?')) {
      const q = memoryStore.coding_questions.find(item => item.id == params[0]);
      return [q ? [q] : [], []];
    }
    if (sqlLower.includes('insert into coding_questions')) {
      const newId = memoryStore.coding_questions.length + 1;
      const newQ = { id: newId, title: params[0], description: params[1], difficulty: params[2], category: params[3], sample_input: params[4], sample_output: params[5], solution: params[6], created_at: new Date() };
      memoryStore.coding_questions.push(newQ);
      return [{ insertId: newId, affectedRows: 1 }, []];
    }
    if (sqlLower.includes('update coding_questions')) {
      const id = params[7];
      const idx = memoryStore.coding_questions.findIndex(q => q.id == id);
      if (idx !== -1) {
        memoryStore.coding_questions[idx] = { ...memoryStore.coding_questions[idx], title: params[0], description: params[1], difficulty: params[2], category: params[3], sample_input: params[4], sample_output: params[5], solution: params[6] };
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }
    if (sqlLower.includes('delete from coding_questions')) {
      const id = params[0];
      const initial = memoryStore.coding_questions.length;
      memoryStore.coding_questions = memoryStore.coding_questions.filter(q => q.id != id);
      return [{ affectedRows: initial - memoryStore.coding_questions.length }, []];
    }
    // Filtered list
    let res = [...memoryStore.coding_questions];
    let search = null, diff = null, cat = null;
    params.forEach(p => {
      if (typeof p === 'string' && p.startsWith('%')) search = p.replace(/%/g, '').toLowerCase();
      else if (['Easy', 'Medium', 'Hard'].includes(p)) diff = p;
      else if (typeof p === 'string') cat = p;
    });

    if (search) res = res.filter(q => q.title.toLowerCase().includes(search) || q.description.toLowerCase().includes(search));
    if (diff) res = res.filter(q => q.difficulty === diff);
    if (cat) res = res.filter(q => q.category === cat);

    return [res, []];
  }

  // 5. INTERVIEW QUESTIONS
  if (sqlLower.includes('from interview_questions')) {
    if (sqlLower.includes('where id = ?')) {
      const q = memoryStore.interview_questions.find(item => item.id == params[0]);
      return [q ? [q] : [], []];
    }
    if (sqlLower.includes('insert into interview_questions')) {
      const newId = memoryStore.interview_questions.length + 1;
      const newQ = { id: newId, question: params[0], answer: params[1], category: params[2], difficulty: params[3], created_at: new Date() };
      memoryStore.interview_questions.push(newQ);
      return [{ insertId: newId, affectedRows: 1 }, []];
    }
    if (sqlLower.includes('update interview_questions')) {
      const id = params[4];
      const idx = memoryStore.interview_questions.findIndex(q => q.id == id);
      if (idx !== -1) {
        memoryStore.interview_questions[idx] = { ...memoryStore.interview_questions[idx], question: params[0], answer: params[1], category: params[2], difficulty: params[3] };
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }
    if (sqlLower.includes('delete from interview_questions')) {
      const id = params[0];
      const initial = memoryStore.interview_questions.length;
      memoryStore.interview_questions = memoryStore.interview_questions.filter(q => q.id != id);
      return [{ affectedRows: initial - memoryStore.interview_questions.length }, []];
    }
    let res = [...memoryStore.interview_questions];
    let search = null, cat = null, diff = null;
    params.forEach(p => {
      if (typeof p === 'string' && p.startsWith('%')) search = p.replace(/%/g, '').toLowerCase();
      else if (['Technical', 'HR'].includes(p)) cat = p;
      else if (['Easy', 'Medium', 'Hard'].includes(p)) diff = p;
    });

    if (search) res = res.filter(q => q.question.toLowerCase().includes(search) || q.answer.toLowerCase().includes(search));
    if (cat) res = res.filter(q => q.category === cat);
    if (diff) res = res.filter(q => q.difficulty === diff);

    return [res, []];
  }

  // 6. ASSESSMENTS
  if (sqlLower.includes('from assessments') || sqlLower.includes('from assessment_questions')) {
    if (sqlLower.includes('select * from assessments where id = ?')) {
      const a = memoryStore.assessments.find(item => item.id == params[0]);
      return [a ? [a] : [], []];
    }
    if (sqlLower.includes('from assessments a') || sqlLower.includes('select a.id')) {
      const res = memoryStore.assessments.map(a => {
        const count = memoryStore.assessment_questions.filter(aq => aq.assessment_id == a.id).length;
        return { ...a, total_questions: count };
      });
      return [res, []];
    }
    if (sqlLower.includes('select q.id, q.title, q.description, q.difficulty, q.category, q.sample_input, q.sample_output')) {
      const assessmentId = params[0];
      const mappedQIds = memoryStore.assessment_questions.filter(aq => aq.assessment_id == assessmentId).map(aq => aq.question_id);
      const questions = memoryStore.coding_questions.filter(q => mappedQIds.includes(q.id));
      return [questions, []];
    }
    if (sqlLower.includes('insert into assessments')) {
      const newId = memoryStore.assessments.length + 1;
      const newA = { id: newId, title: params[0], description: params[1], duration: params[2], created_at: new Date() };
      memoryStore.assessments.push(newA);
      return [{ insertId: newId, affectedRows: 1 }, []];
    }
    if (sqlLower.includes('insert into assessment_questions')) {
      const mappings = params[0] || [];
      mappings.forEach(m => {
        memoryStore.assessment_questions.push({ id: memoryStore.assessment_questions.length + 1, assessment_id: m[0], question_id: m[1] });
      });
      return [{ affectedRows: mappings.length }, []];
    }
    if (sqlLower.includes('update assessments')) {
      const id = params[3];
      const idx = memoryStore.assessments.findIndex(a => a.id == id);
      if (idx !== -1) {
        memoryStore.assessments[idx] = { ...memoryStore.assessments[idx], title: params[0], description: params[1], duration: params[2] };
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 0 }, []];
    }
    if (sqlLower.includes('delete from assessment_questions where assessment_id = ?')) {
      memoryStore.assessment_questions = memoryStore.assessment_questions.filter(aq => aq.assessment_id != params[0]);
      return [{ affectedRows: 1 }, []];
    }
    if (sqlLower.includes('delete from assessments where id = ?')) {
      const id = params[0];
      memoryStore.assessments = memoryStore.assessments.filter(a => a.id != id);
      memoryStore.assessment_questions = memoryStore.assessment_questions.filter(aq => aq.assessment_id != id);
      return [{ affectedRows: 1 }, []];
    }
  }

  // 7. ASSESSMENT ATTEMPTS
  if (sqlLower.includes('from assessment_attempts')) {
    if (sqlLower.includes('insert into assessment_attempts')) {
      const newId = memoryStore.assessment_attempts.length + 1;
      const newAttempt = {
        id: newId,
        user_id: params[0],
        assessment_id: params[1],
        score: params[2],
        total_questions: params[3],
        started_at: new Date(),
        completed_at: new Date()
      };
      memoryStore.assessment_attempts.push(newAttempt);
      return [{ insertId: newId, affectedRows: 1 }, []];
    }
    if (sqlLower.includes('where aa.id = ? and aa.user_id = ?')) {
      const attemptId = params[0];
      const userId = params[1];
      const att = memoryStore.assessment_attempts.find(a => a.id == attemptId && a.user_id == userId);
      if (!att) return [[], []];
      const ass = memoryStore.assessments.find(a => a.id == att.assessment_id) || {};
      return [[{
        attempt_id: att.id,
        assessment_id: att.assessment_id,
        assessment_title: ass.title || 'Assessment',
        score: att.score,
        total_questions: att.total_questions,
        started_at: att.started_at,
        completed_at: att.completed_at
      }], []];
    }
    if (sqlLower.includes('where aa.user_id = ?')) {
      const userId = params[0];
      const userAttempts = memoryStore.assessment_attempts.filter(a => a.user_id == userId);
      const res = userAttempts.map(att => {
        const ass = memoryStore.assessments.find(a => a.id == att.assessment_id) || {};
        return {
          attempt_id: att.id,
          assessment_id: att.assessment_id,
          assessment_title: ass.title || 'Assessment',
          score: att.score,
          total_questions: att.total_questions,
          started_at: att.started_at,
          completed_at: att.completed_at
        };
      });
      return [res, []];
    }
  }

  return [[], []];
};

// Hybrid Pool Object that uses MySQL when online and Fallback Store when MySQL is stopped
const dbPool = {
  async query(sql, params = []) {
    if (isMysqlOnline) {
      try {
        return await mysqlPool.query(sql, params);
      } catch (err) {
        console.warn('⚠️ MySQL Query Failed, using Fallback Store:', err.message);
        isMysqlOnline = false;
        return executeFallbackQuery(sql, params);
      }
    } else {
      return executeFallbackQuery(sql, params);
    }
  },

  async getConnection() {
    return mysqlPool.getConnection();
  }
};

// Helper function to test database connection on startup
const testConnection = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    console.log('✅ Connected to MySQL database successfully.');
    isMysqlOnline = true;
    connection.release();
    return true;
  } catch (error) {
    console.log('💡 Note: Local MySQL server service is stopped. CodePrep is running with pre-populated Data Provider.');
    isMysqlOnline = false;
    return false;
  }
};

module.exports = {
  dbPool,
  testConnection
};
