const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjVhMzNjNGMxMWE5N2E1Njg4NWY0OCIsImlhdCI6MTc3NzcxNTE3OSwiZXhwIjoxNzc4MzE5OTc5fQ.wciUFeU98Mrifx7pQaG459fa8ka7tZ7vLFJ9Q0MuUNw";
const URL = "https://api.mymaxkapital.com/records/post";

const firstNames = ["Rajesh", "Mohammed", "Suresh", "Priya", "Amit", "Anita", "Vikram", "Sneha", "Rahul", "Pooja", "Arun", "Kavita", "Sanjay", "Deepa", "Karthik", "Ramesh", "Gita", "Anand", "Nisha", "Manoj"];
const lastNames = ["Kumar", "Irfan", "Sharma", "Singh", "Patel", "Reddy", "Nair", "Iyer", "Rao", "Das", "Gupta", "Jain", "Menon", "Pillai", "Verma"];
const businesses = ["Trading", "Retail", "Manufacturing", "Services", "Consulting", "Wholesale", "Transport", "Hardware", "Garments", "Electronics"];
const cities = ["Bangalore", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat"];
const banks = ["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda"];
const businessTypes = ["Proprietorship", "Partnership", "Private Limited", "LLP", "Public Limited"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function generateMobile() {
  return `9${randomInt(100000000, 999999999)}`;
}

const records = [];

for (let i = 3; i <= 52; i++) {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const name = `${firstName} ${lastName}`;
  const city = randomItem(cities);
  const business = randomItem(businesses);
  const bank = randomItem(banks);
  
  const record = {
    applicationNumber: `APP-2024-${i.toString().padStart(3, '0')}`,
    name: name,
    dirPartners: `${randomInt(1, 4)}`,
    dirPartnersName: `Partner ${randomItem(firstNames)}`,
    mobile1: generateMobile(),
    mobile2: generateMobile(),
    mobile3: generateMobile(),
    landMark: `Near Main Square, ${city}`,
    residenceAddress: `Plot ${randomInt(1, 100)}, Cross ${randomInt(1, 10)}, ${city} - ${randomInt(100000, 999999)}`,
    officeAddress: `Shop ${randomInt(1, 50)}, Commercial Complex, ${city} - ${randomInt(100000, 999999)}`,
    bankName: bank,
    accountNo: `${randomInt(100000000000, 999999999999)}`,
    gstNo: `${randomInt(10, 99)}ABCDE${randomInt(1000, 9999)}F1Z${randomInt(1, 9)}`,
    noOfCv: `${randomInt(0, 5)}`,
    noOfCars: `${randomInt(0, 3)}`,
    landArea: `${randomInt(1000, 5000)} sqft`,
    building: `Commercial Property`,
    businessNature: `${business}`,
    turnOver: `${randomInt(10, 200)},00,000`,
    creditPeriod: `${randomItem([15, 30, 45, 60])} Days`,
    cibil: `${randomInt(650, 850)}`,
    ccLimit: `${randomInt(5, 50)},00,000`,
    mainAccounts: `${bank}`,
    businessRef1: `Supplier A - ${generateMobile()}`,
    businessRef2: `Supplier B - ${generateMobile()}`,
    spouseName: `Spouse of ${firstName}`,
    chequeRtnCcAc: `${randomItem([0, 0, 0, 1])}`,
    chequeRtnCurrentAc: `${randomItem([0, 0, 1])}`,
    chequeRtnSbAc: `${randomItem([0, 0, 1])}`,
    propertySyNo: `SY NO ${randomInt(1, 200)}/${randomItem(['A', 'B', 'C'])}`,
    propertyTitleDeedNo: `TD-202${randomInt(0, 3)}-${randomInt(100000, 999999)}`,
    propertyArea: `${randomInt(1000, 5000)} sqft`,
    buildingArea: `${randomInt(500, 3000)} sqft`,
    emiClearingAccount: `${bank} - ${randomInt(100000000000, 999999999999)}`,
    securityCheque: `${randomInt(1, 5)} Cheques - ${bank}`,
    purposeOfLoans: "Working Capital",
    docCollected: "Aadhar, PAN, Bank Statements, ITR",
    pendings: randomItem(["None", "GST Returns", "Property Tax Receipt", "Utility Bill"]),
    negative: randomItem(["None", "None", "None", "High Credit Utilization", "Late payment in 2022"]),
    pdComments: "Customer is cooperative. Business looks stable.",
    remarks: randomItem(["Recommended", "Approved", "Requires further review", "Moderate risk"]),
    loanAmt: `${randomInt(5, 100)},00,000`,
    tenure: `${randomItem([12, 24, 36, 48, 60])} Months`,
    emi: `${randomInt(10, 99)},${randomInt(100, 999)}`,
    disbDate: `2024-${randomInt(1, 12).toString().padStart(2, '0')}-15`,
    emiStartDate: `2024-${randomInt(1, 12).toString().padStart(2, '0')}-01`,
    emiEndDate: `2027-${randomInt(1, 12).toString().padStart(2, '0')}-01`,
    typeOfBusiness: randomItem(businessTypes)
  };
  
  records.push(record);
}

async function seedData() {
  console.log(`Starting to seed ${records.length} records...`);
  
  for (let i = 0; i < records.length; i++) {
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify(records[i])
      });
      
      if (response.ok) {
        console.log(`✅ [${i + 1}/${records.length}] Successfully added: ${records[i].name} (${records[i].applicationNumber})`);
      } else {
        const error = await response.json();
        console.error(`❌ [${i + 1}/${records.length}] Failed to add: ${records[i].name} -`, error);
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`❌ Network error on record ${i + 1}:`, err.message);
    }
  }
  
  console.log("Seeding complete!");
}

seedData();
