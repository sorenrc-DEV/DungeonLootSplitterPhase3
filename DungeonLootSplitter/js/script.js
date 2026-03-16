const STORAGE_KEY = "lootSplitterState";

let lootArray = [];
let partySize = 1;

document.getElementById("addLootBtn").addEventListener("click", addLoot);
document.getElementById("splitLootBtn").addEventListener("click", splitLoot);
document.getElementById("resetBtn").addEventListener("click", resetAll);

function saveState(){

const state = {
loot: lootArray,
partySize: partySize
};

localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

}

function restoreState(){

const saved = localStorage.getItem(STORAGE_KEY);

if(!saved){
return;
}

try{

const parsed = JSON.parse(saved);

if(typeof parsed !== "object"){
return;
}

if(typeof parsed.partySize === "number" && parsed.partySize >= 1){
partySize = parsed.partySize;
document.getElementById("partySize").value = partySize;
}

if(Array.isArray(parsed.loot)){

for(let i = 0; i < parsed.loot.length; i++){

const item = parsed.loot[i];

if(
item &&
typeof item.name === "string" &&
item.name.trim() !== "" &&
typeof item.value === "number" &&
item.value >= 0
){
lootArray.push({
name: item.name,
value: item.value
});
}

}

}

}catch(error){

console.log("State restore failed. Using defaults.");

}

}

function addLoot(){

const lootNameInput = document.getElementById("lootName");
const lootValueInput = document.getElementById("lootValue");
const errorDisplay = document.getElementById("lootError");

const name = lootNameInput.value.trim();
const value = parseFloat(lootValueInput.value);

errorDisplay.textContent = "";

if(name === ""){
errorDisplay.textContent = "Loot name cannot be empty.";
return;
}

if(isNaN(value)){
errorDisplay.textContent = "Loot value must be a number.";
return;
}

if(value < 0){
errorDisplay.textContent = "Loot value cannot be negative.";
return;
}

lootArray.push({
name: name,
value: value
});

lootNameInput.value = "";
lootValueInput.value = "";

saveState();
updateUI();

}

function removeLoot(index){

lootArray.splice(index,1);

saveState();
updateUI();

}

function splitLoot(){

const partySizeInput = document.getElementById("partySize");
const splitError = document.getElementById("splitError");
const finalTotal = document.getElementById("finalTotal");
const lootPerMember = document.getElementById("lootPerMember");

partySize = parseInt(partySizeInput.value);

splitError.textContent = "";

if(isNaN(partySize) || partySize < 1){
splitError.textContent = "Party size must be at least 1.";
return;
}

if(lootArray.length === 0){
splitError.textContent = "No loot to split.";
return;
}

let total = 0;

for(let i = 0; i < lootArray.length; i++){
total += lootArray[i].value;
}

const splitAmount = total / partySize;

finalTotal.textContent = total.toFixed(2);
lootPerMember.textContent = splitAmount.toFixed(2);

saveState();

}

function updateUI(){

const splitBtn = document.getElementById("splitLootBtn");
const lootList = document.getElementById("lootList");
const totalLootDisplay = document.getElementById("totalLoot");

lootList.innerHTML = "";

if(lootArray.length === 0){

const li = document.createElement("li");
li.textContent = "No loot added";
li.style.textAlign = "center";

lootList.appendChild(li);

}

let total = 0;

for(let i = 0; i < lootArray.length; i++){

const li = document.createElement("li");

const nameSpan = document.createElement("span");
nameSpan.textContent = lootArray[i].name;

const valueSpan = document.createElement("span");
valueSpan.textContent = "$" + lootArray[i].value.toFixed(2);

const removeBtn = document.createElement("button");
removeBtn.textContent = "Remove";

removeBtn.addEventListener("click", function(){
removeLoot(i);
});

li.appendChild(nameSpan);
li.appendChild(valueSpan);
li.appendChild(removeBtn);

lootList.appendChild(li);

total += lootArray[i].value;

}

totalLootDisplay.textContent = total.toFixed(2);

if(lootArray.length === 0){
splitBtn.disabled = true;
}else{
splitBtn.disabled = false;
}

}

function resetAll(){

lootArray = [];
partySize = 1;

document.getElementById("partySize").value = 1;

localStorage.removeItem(STORAGE_KEY);

updateUI();

}

document.addEventListener("DOMContentLoaded", function(){

restoreState();
updateUI();

});