// 16-Bit Retro RPG Pixel Art Avatars by Gender

const MALE_SEEDS = [
  'Alexander', 'Felix', 'Sebastian', 'Mason', 'James',
  'Logan', 'Ethan', 'Caleb', 'Ryan', 'Oliver', 'Lucas', 'Leo'
];

const FEMALE_SEEDS = [
  'Zoey', 'Willow', 'Samantha', 'Maya', 'Amelia',
  'Chloe', 'Penelope', 'Victoria', 'Grace', 'Hannah', 'Lily', 'Sofia'
];

const MALE_FIRST_NAMES = new Set([
  'arjun', 'raj', 'amit', 'rahul', 'vikram', 'rohan', 'siddharth', 'dev', 'karan',
  'alex', 'john', 'michael', 'david', 'james', 'robert', 'william', 'richard', 'joseph',
  'thomas', 'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'mark', 'donald',
  'steven', 'paul', 'andrew', 'joshua', 'kenneth', 'kevin', 'brian', 'george', 'timothy',
  'ronald', 'edward', 'jason', 'aditya', 'aakash', 'anand', 'deepak', 'manish', 'neeraj',
  'nikhil', 'prashant', 'praveen', 'punit', 'rajesh', 'ramesh', 'sachin', 'sanjay',
  'satish', 'shivam', 'sumit', 'suresh', 'tarun', 'varun', 'vijay', 'yash', 'aryan', 'harsh',
  'vivek', 'gautam', 'kunis', 'akshay', 'kartik', 'rishi', 'suraj', 'vinay', 'abhishek'
]);

const FEMALE_FIRST_NAMES = new Set([
  'sona', 'priya', 'kavya', 'ananya', 'pooja', 'sneha', 'ria', 'neha', 'divya', 'isha',
  'aarti', 'aditi', 'amita', 'anita', 'anjali', 'archana', 'bhavna', 'deepa', 'geeta',
  'jyoti', 'kiran', 'lata', 'meena', 'monica', 'nisha', 'payal', 'poonam', 'radha',
  'rekha', 'ritu', 'seema', 'shilpa', 'shweta', 'sunita', 'swati', 'tanvi', 'uma',
  'vaishali', 'vandana', 'yashika', 'sarah', 'emily', 'jessica', 'ashley', 'amanda',
  'stephanie', 'elizabeth', 'nicole', 'jennifer', 'rachel', 'lauren', 'megan', 'hannah'
]);

function isMaleGender(nameStr, genderStr) {
  if (genderStr) {
    const g = String(genderStr).toLowerCase();
    if (g.includes('male') || g === 'm' || g === 'man') return true;
    if (g.includes('female') || g === 'f' || g === 'woman') return false;
  }

  if (nameStr) {
    const firstName = String(nameStr).trim().split(/\s+/)[0].toLowerCase();
    if (MALE_FIRST_NAMES.has(firstName)) return true;
    if (FEMALE_FIRST_NAMES.has(firstName)) return false;
  }

  return null;
}

// Simple hash for deterministic index mapping
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getEmployeeAvatar(emp, nameHint) {
  let empId = typeof emp === 'string' ? emp : (emp?.employee_id || emp?.id || 'EMP001');
  let name = typeof emp === 'object' ? emp?.name : (nameHint || (typeof emp === 'string' && !emp.startsWith('EMP') ? emp : 'Sona VR'));
  let gender = typeof emp === 'object' ? emp?.gender : undefined;

  const isMale = isMaleGender(name, gender);
  const identifier = (name || empId || 'avatar').toLowerCase();
  const hashIdx = hashString(identifier);

  if (isMale === true) {
    const seed = MALE_SEEDS[hashIdx % MALE_SEEDS.length];
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&scale=100`;
  } else if (isMale === false) {
    const seed = FEMALE_SEEDS[hashIdx % FEMALE_SEEDS.length];
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&scale=100`;
  }

  // Fallback
  const seed = (hashIdx % 2 === 0 ? MALE_SEEDS : FEMALE_SEEDS)[hashIdx % MALE_SEEDS.length];
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&scale=100`;
}
