-- CodePrep Database Seed Data

USE CodePrep;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE assessment_attempts;
TRUNCATE TABLE assessment_questions;
TRUNCATE TABLE assessments;
TRUNCATE TABLE interview_questions;
TRUNCATE TABLE coding_questions;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users (Password is 'admin123' and 'user123' hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@codeprep.com', '$2a$10$Book0iA3X13rGp122imM/efBPF4FFeHVhZqDkrBZc2ymRx1xaEk9m', 'ADMIN'),
('Student User', 'user@codeprep.com', '$2a$10$RthjoohUiV2qIsslPhCwFOBXLT8GjIe/hOTXP4EDkU0y7ErfBYuU6', 'USER');

-- 2. Insert 10 Coding Questions
INSERT INTO coding_questions (id, title, description, difficulty, category, sample_input, sample_output, solution) VALUES
(1, 'Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'Easy', 'Arrays', 'nums = [2,7,11,15], target = 9', '[0,1]', 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'),

(2, 'Reverse a String', 'Write a function that reverses a string. The input string is given as an array of characters.', 'Easy', 'Strings', '["h","e","l","l","o"]', '["o","l","l","e","h"]', 'function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  return s;\n}'),

(3, 'Binary Search', 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.', 'Easy', 'Searching', 'nums = [-1,0,3,5,9,12], target = 9', '4', 'function binarySearch(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}'),

(4, 'Merge Sort', 'Implement Merge Sort to sort an array of numbers in ascending order.', 'Medium', 'Sorting', 'nums = [5,2,3,1]', '[1,2,3,5]', 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(left, right) {\n  let res = [], i = 0, j = 0;\n  while(i < left.length && j < right.length) {\n    if (left[i] < right[j]) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  return res.concat(left.slice(i)).concat(right.slice(j));\n}'),

(5, 'Valid Parentheses', 'Given a string containing just brackets, determine if the input string is valid.', 'Easy', 'Data Structures', 's = "()[]{}"', 'true', 'function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  for (let char of s) {\n    if (["(", "{", "["].includes(char)) stack.push(char);\n    else if (stack.pop() !== map[char]) return false;\n  }\n  return stack.length === 0;\n}'),

(6, 'Maximum Subarray Sum', 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', 'Medium', 'Algorithms', 'nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', 'function maxSubArray(nums) {\n  let maxSum = nums[0], currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}'),

(7, 'Detect Loop in Linked List', 'Given head of a linked list, determine if the linked list has a cycle in it.', 'Medium', 'Data Structures', 'head = [3,2,0,-4], pos = 1', 'true', 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}'),

(8, 'Palindrome Check', 'Determine whether an integer or string reads the same backward as forward.', 'Easy', 'Strings', 's = "racecar"', 'true', 'function isPalindrome(s) {\n  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return cleaned === cleaned.split("").reverse().join("");\n}'),

(9, 'Find Missing Number', 'Given an array nums containing n distinct numbers in range [0, n], return the only number missing.', 'Easy', 'Arrays', 'nums = [3,0,1]', '2', 'function missingNumber(nums) {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);\n  return expectedSum - actualSum;\n}'),

(10, 'Longest Substring Without Repeating Characters', 'Find the length of the longest substring without repeating characters.', 'Hard', 'Strings', 's = "abcabcbb"', '3', 'function lengthOfLongestSubstring(s) {\n  let set = new Set(), maxLen = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}');

-- 3. Insert 15 Interview Questions (9 Technical, 6 HR)
INSERT INTO interview_questions (id, question, answer, category, difficulty) VALUES
(1, 'What is the difference between a process and a thread?', 'A process is an independent executing program with its own memory space allocated by the OS. A thread is a lightweight execution path within a process. Threads of the same process share memory space and resources.', 'Technical', 'Easy'),

(2, 'Explain the four primary principles of Object-Oriented Programming (OOP).', '1. Encapsulation: Bundling data and methods operating on that data into a single unit.\n2. Abstraction: Hiding internal complexity and showing only necessary features.\n3. Inheritance: Mechanism to create new classes based on existing ones.\n4. Polymorphism: Ability to present the same interface for different underlying forms.', 'Technical', 'Easy'),

(3, 'What is the difference between Primary Key and Foreign Key in DBMS?', 'A Primary Key uniquely identifies a record in a table and cannot contain NULL values. A Foreign Key is a field in one table that references the Primary Key of another table, establishing a relationship between them.', 'Technical', 'Easy'),

(4, 'How does asynchronous programming work in JavaScript (Event Loop)?', 'JavaScript is single-threaded. Async operations are handled via Web APIs/Node APIs, callback queues, microtask queues (promises), and the Event Loop, which continuously pushes tasks from queues to the call stack once it is empty.', 'Technical', 'Medium'),

(5, 'What is the difference between REST API and GraphQL?', 'REST APIs expose specific endpoints for specific resources (over-fetching or under-fetching data can occur). GraphQL allows clients to request exactly the data fields they need using a single endpoint.', 'Technical', 'Medium'),

(6, 'Explain Database Indexing and how it improves query performance.', 'Database indexing is a data structure technique (e.g., B-Trees) that speeds up data retrieval operations on a table at the cost of additional write time and storage space.', 'Technical', 'Medium'),

(7, 'What is the difference between Stack and Queue data structures?', 'A Stack follows LIFO (Last In First Out) principles (e.g., call stack, undo operation). A Queue follows FIFO (First In First Out) principles (e.g., task scheduling, printing jobs).', 'Technical', 'Easy'),

(8, 'What are ACID properties in Database Management Systems?', 'ACID stands for:\n- Atomicity: Transactions are all-or-nothing.\n- Consistency: Database moves from one valid state to another.\n- Isolation: Concurrent transactions executed independently.\n- Durability: Committed transactions persist permanently.', 'Technical', 'Medium'),

(9, 'What is Big O Notation and why is it important?', 'Big O notation describes the upper bound performance or execution time of an algorithm in terms of input size (N). It helps compare efficiency in worst-case scenarios for time and space complexity.', 'Technical', 'Easy'),

(10, 'Tell me about yourself.', 'Structure your answer using Present, Past, and Future frame:\n1. Present: Current status/education and skills.\n2. Past: Relevant projects or experiences.\n3. Future: Why this role/platform aligns with your career goals.', 'HR', 'Easy'),

(11, 'What are your greatest strengths and weaknesses?', 'Strength: Provide a job-relevant skill with a quick real example (e.g., problem-solving, adaptability).\nWeakness: Share a genuine area of improvement, and explain active steps you take to address it.', 'HR', 'Easy'),

(12, 'Why do you want to join our organization?', 'Show research about the company, mention specific products/culture that excite you, and connect them with your passion for growth and contributing value.', 'HR', 'Easy'),

(13, 'Where do you see yourself in five years?', 'Demonstrate ambition and realistic growth. Mention mastering technical domain knowledge, taking leadership responsibilities, and adding value to projects.', 'HR', 'Easy'),

(14, 'Describe a challenging project situation and how you handled it.', 'Use the STAR method:\n- Situation: Context of the problem.\n- Task: What needed to be done.\n- Action: Steps YOU took to resolve it.\n- Result: Quantifiable or positive outcome achieved.', 'HR', 'Medium'),

(15, 'Why should we hire you over other candidates?', 'Highlight the combination of your technical foundation, problem-solving mindset, fast learning ability, and dedication to delivering quality solutions.', 'HR', 'Easy');

-- 4. Insert Assessments
INSERT INTO assessments (id, title, description, duration) VALUES
(1, 'Data Structures & Algorithms Basics', 'Test your fundamental knowledge of Arrays, Strings, Searching, and Basic Data Structures.', 30),
(2, 'Intermediate Problem Solving', 'Challenge your understanding of Sorting, Subarrays, Linked Lists, and Algorithm Optimization.', 45),
(3, 'Full Stack Technical Assessment', 'Comprehensive coding assessment evaluating algorithmic efficiency and problem-solving abilities.', 60),
(4, 'Advanced Algorithmic Challenge', 'Test advanced Dynamic Programming, Graphs, and Complex Data Structure optimization.', 60),
(5, 'SQL & Database Querying Exam', 'Evaluate your knowledge of relational database schema design, indexing, and complex queries.', 40),
(6, 'Frontend React & JS Architecture', 'Assess modern JavaScript ES6+, asynchronous programming, and React state management.', 45),
(7, 'OOP & System Design Fundamentals', 'Test Object-Oriented Principles, design patterns, clean code practices, and scalability.', 35);

-- 5. Insert Assessment Questions Mapping (5 Questions per Assessment)
INSERT INTO assessment_questions (assessment_id, question_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 5), (1, 8),
(2, 4), (2, 6), (2, 7), (2, 9), (2, 11),
(3, 1), (3, 4), (3, 6), (3, 7), (3, 10),
(4, 12), (4, 16), (4, 17), (4, 19), (4, 20),
(5, 1), (5, 3), (5, 8), (5, 9), (5, 12),
(6, 2), (6, 5), (6, 8), (6, 10), (6, 15),
(7, 3), (7, 13), (7, 14), (7, 16), (7, 18);
