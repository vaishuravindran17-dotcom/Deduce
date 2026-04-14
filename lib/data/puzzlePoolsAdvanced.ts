import type { LinkGridPuzzle, TimeTracePuzzle, TrueLiePuzzle, CodeBreakPuzzle } from '@/types';

// ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
// 4-person grids, indirect clues, 4-digit codes

export const LINK_GRID_INTERMEDIATE: LinkGridPuzzle[] = [
  { people:['Asha','Ravi','Neha','Dev'], categoryA:['Lab','Office','Vault','Lobby'], categoryB:['Badge','Folder','Disk','Key'],
    clues:['Ravi is in the Office','The Vault has the Disk','Neha has the Badge','Dev is not in the Lab','Asha does not have the Folder','The Lobby does not have the Key'],
    question:'Who is in the Lab?', answer:'Asha' },
  { people:['Ines','Leon','Maya','Niko'], categoryA:['North','South','East','West'], categoryB:['Torch','Rope','Map','Compass'],
    clues:['Leon is in the South','The North has the Compass','Niko is in the East','Maya is not in the North','The West has the Map','Leon does not have the Torch'],
    question:'Who has the Torch?', answer:'Niko' },
  { people:['Ada','Ben','Cara','Dan'], categoryA:['Roof','Floor 1','Floor 2','Basement'], categoryB:['Wrench','Cable','Lock','Drill'],
    clues:['Cara is on Floor 2','The Basement has the Drill','Ada is not on the Roof','Dan is in the Basement','Ben does not have the Cable','Ada has the Lock'],
    question:'Who is on the Roof?', answer:'Ben' },
  { people:['Eli','Fara','Gio','Hira'], categoryA:['Tower','Bridge','Gate','Moat'], categoryB:['Sword','Shield','Bow','Arrow'],
    clues:['Fara is at the Bridge','Gio is not at the Tower or Moat','Hira is not at the Gate','Eli is not at the Moat','The Tower has the Bow','The Gate has the Arrow'],
    question:'Who is at the Tower?', answer:'Eli' },
  { people:['Jay','Kira','Leo','Mia'], categoryA:['Station A','Station B','Station C','Station D'], categoryB:['Red Box','Blue Box','Green Box','Black Box'],
    clues:['Kira is at Station B','Leo is not at Station A or Station B','The Station C has the Green Box','Mia does not have the Black Box','Station D has the Black Box','Jay is not at Station C or Station D'],
    question:'Who is at Station D?', answer:'Leo' },
  { people:['Nora','Otto','Pam','Quin'], categoryA:['Level 1','Level 2','Level 3','Level 4'], categoryB:['Gold','Silver','Bronze','Copper'],
    clues:['Pam is on Level 3','Level 1 has the Gold','Otto is not on Level 2 or Level 4','Quin does not have the Silver','Level 4 has the Copper','Nora is not on Level 1','Quin is not on Level 4'],
    question:'Who is on Level 4?', answer:'Nora' },
  { people:['Rita','Sam','Tina','Uma'], categoryA:['Park','Mall','Gym','Library'], categoryB:['Phone','Keys','Wallet','Watch'],
    clues:['Sam is at the Mall','The Park has the Phone','Uma is not at the Park or Gym','Rita does not have the Watch','The Library has the Watch','Tina is not at the Library','Rita is not at the Gym'],
    question:'Who is at the Park?', answer:'Rita' },
  { people:['Vance','Wren','Xena','Yael'], categoryA:['Cabin','Tent','Hut','Cave'], categoryB:['Lantern','Axe','Rope','Flare'],
    clues:['Wren is in the Tent','The Cave has the Flare','Xena is not in the Cabin or Cave','Vance does not have the Lantern','The Hut has the Rope','Yael is not in the Tent or Hut','Vance is not in the Cabin'],
    question:'Who is in the Cave?', answer:'Vance' },
];

export const TIME_TRACE_INTERMEDIATE: TimeTracePuzzle[] = [
  { slots:['9 AM','10 AM','11 AM','12 PM'], entities:['Asha','Ravi','Neha','Dev'],
    clues:['Dev was the first to arrive','Neha arrived after Ravi','Asha was not last','The break-in happened at 10 AM'],
    question:'Who was at the scene at 10 AM?', answer:'Asha' },
  { slots:['6 PM','7 PM','8 PM','9 PM'], entities:['Lina','Omar','Priya','Sam'],
    clues:['Priya was the first to arrive','Sam arrived immediately after Priya','Lina arrived before Omar','The theft happened at 7 PM'],
    question:'Who was present at 7 PM?', answer:'Sam' },
  { slots:['1 AM','2 AM','3 AM','4 AM'], entities:['Finn','Gael','Hana','Ines'],
    clues:['Hana was the last to arrive','Gael was neither first nor last','Finn arrived before Ines','The crime happened at 2 AM'],
    question:'Who was at the scene at 2 AM?', answer:'Gael' },
  { slots:['3 PM','4 PM','5 PM','6 PM'], entities:['Zara','Alex','Bex','Cole'],
    clues:['Bex arrived after Cole','Alex arrived last','Bex arrived before Zara','The incident happened at 4 PM'],
    question:'Who was present at 4 PM?', answer:'Bex' },
  { slots:['11 PM','12 AM','1 AM','2 AM'], entities:['Maya','Noel','Ora','Paz'],
    clues:['Paz was the first to arrive','Ora arrived after Maya','Noel was not second to arrive','The crime happened at 12 AM'],
    question:'Who was at the scene at 12 AM?', answer:'Maya' },
  { slots:['8 AM','9 AM','10 AM','11 AM'], entities:['Reid','Sia','Teo','Uma'],
    clues:['Uma arrived last','Reid arrived before Sia','Sia arrived before Teo','The incident happened at 9 AM'],
    question:'Who was present at 9 AM?', answer:'Sia' },
  { slots:['5 AM','6 AM','7 AM','8 AM'], entities:['Vick','Wren','Xara','Yael'],
    clues:['Vick was the first to arrive','Yael arrived last','Xara arrived before Wren','The disappearance happened at 6 AM'],
    question:'Who was at the scene at 6 AM?', answer:'Xara' },
  { slots:['2 PM','3 PM','4 PM','5 PM'], entities:['Abe','Bel','Cy','Dot'],
    clues:['Bel arrived last','Abe arrived before Dot','Dot arrived before Cy','The theft happened at 3 PM'],
    question:'Who was present at 3 PM?', answer:'Dot' },
];

export const TRUE_LIE_INTERMEDIATE: TrueLiePuzzle[] = [
  { statements:[{person:'Asha',text:"I left before the vault was opened"},{person:'Ravi',text:'Asha was still inside when I arrived'},{person:'Neha',text:'Ravi is telling the truth about Asha'},{person:'Dev',text:'I saw Asha leave before the vault was touched'}], question:'Who is lying?', answer:'Asha' },
  { statements:[{person:'Lina',text:'Omar was the last to leave the room'},{person:'Omar',text:'I left before Priya did'},{person:'Priya',text:"I was gone before Omar"},{person:'Sam',text:"Priya's statement matches what I saw"}], question:'Who is lying?', answer:'Omar' },
  { statements:[{person:'Finn',text:"I never entered the storage area"},{person:'Gael',text:'I saw Finn walking toward storage at midnight'},{person:'Hana',text:"Gael's account is accurate"},{person:'Ines',text:"I was with Finn the whole time — he never went to storage"}], question:'Who is lying?', answer:'Finn' },
  { statements:[{person:'Zara',text:"Alex did not attend the meeting"},{person:'Alex',text:'I was at the meeting for the full hour'},{person:'Bex',text:'I arrived late but Alex was already there'},{person:'Cole',text:"Zara left before the meeting started"}], question:'Who is lying?', answer:'Zara' },
  { statements:[{person:'Maya',text:'Noel had access to the server room'},{person:'Noel',text:'My keycard was never used after 9 PM'},{person:'Ora',text:'I saw Noel swipe in at 11 PM'},{person:'Paz',text:"Maya's concern about Noel is well-founded"}], question:'Who is lying?', answer:'Noel' },
  { statements:[{person:'Reid',text:"Sia wasn't in the building that night"},{person:'Sia',text:'I worked late and left at midnight'},{person:'Teo',text:"Sia asked me to cover for her absence"},{person:'Uma',text:"Reid is mistaken — I saw Sia at her desk"}], question:'Who is lying?', answer:'Teo' },
  { statements:[{person:'Vick',text:'Wren borrowed my passcode without permission'},{person:'Wren',text:"I have my own access — I would never need Vick's code"},{person:'Xara',text:"Wren's code was used twice that evening"},{person:'Yael',text:"Vick's complaint against Wren is legitimate"}], question:'Who is lying?', answer:'Wren' },
  { statements:[{person:'Abe',text:'Bel was nowhere near the evidence room'},{person:'Bel',text:'I only passed the evidence room briefly'},{person:'Cy',text:"Abe's alibi checks out — he was with me"},{person:'Dot',text:'I saw Bel inside the evidence room, not just passing'}], question:'Who is lying?', answer:'Bel' },
];

export const CODE_BREAK_INTERMEDIATE: CodeBreakPuzzle[] = [
  { clues:[{guess:'3567',hint:'1 correct in right place'},{guess:'1289',hint:'2 correct but wrong place'},{guess:'4031',hint:'3 correct but wrong place'}], answer:'3142' },
  { clues:[{guess:'1298',hint:'1 correct in right place'},{guess:'4567',hint:'none correct'},{guess:'3019',hint:'2 correct but wrong place'}], answer:'1370' },
  { clues:[{guess:'5678',hint:'none correct'},{guess:'9234',hint:'2 correct in right place'},{guess:'1302',hint:'2 correct but wrong place'}], answer:'9231' },
  { clues:[{guess:'2345',hint:'1 correct in right place'},{guess:'6789',hint:'none correct'},{guess:'1032',hint:'3 correct but wrong place'}], answer:'4312' },
  { clues:[{guess:'7890',hint:'none correct'},{guess:'1234',hint:'2 correct in right place'},{guess:'5162',hint:'2 correct but wrong place'}], answer:'1264' },
  { clues:[{guess:'4567',hint:'1 correct in right place'},{guess:'8901',hint:'none correct'},{guess:'2436',hint:'3 correct but wrong place'}], answer:'6453' },
  { clues:[{guess:'1234',hint:'2 correct in right place'},{guess:'5678',hint:'none correct'},{guess:'9102',hint:'2 correct but wrong place'}], answer:'1239' },
  { clues:[{guess:'8765',hint:'1 correct in right place'},{guess:'4321',hint:'2 correct but wrong place'},{guess:'9876',hint:'1 correct in right place, 1 correct but wrong place'}], answer:'8312' },
];

// ─── HARD ─────────────────────────────────────────────────────────────────────
// 4-person, multi-step elimination, 4-digit codes with combined hints

export const LINK_GRID_HARD: LinkGridPuzzle[] = [
  { people:['Anya','Boris','Clara','Diego'], categoryA:['Alpha','Beta','Gamma','Delta'], categoryB:['Red','Blue','Green','Yellow'],
    clues:['Boris is in Alpha','Clara is not in Beta or Gamma','Alpha has the Red item','Neither Anya nor Diego is in Delta','Gamma has the Blue item','Clara does not have the Green item','Anya does not have the Blue item'],
    question:'Who is in Beta?', answer:'Anya' },
  { people:['Elsa','Felix','Gina','Hugo'], categoryA:['Room 1','Room 2','Room 3','Room 4'], categoryB:['Laptop','Tablet','Phone','Camera'],
    clues:['Room 1 has the Laptop','Neither Elsa nor Felix is in Room 1','Hugo is not in Room 1 or Room 2','Hugo is not in Room 3','Gina does not have the Camera','Room 4 has the Camera','Felix is not in Room 3 or Room 4'],
    question:'Who is in Room 3?', answer:'Elsa' },
  { people:['Ida','Jake','Kole','Lena'], categoryA:['Zone X','Zone Y','Zone Z','Zone W'], categoryB:['Wrench','Pliers','Hammer','Drill'],
    clues:['Neither Ida nor Lena is in Zone X','Jake is not in Zone Y or Zone W','Zone X has the Hammer','Kole does not have the Drill','Zone W has the Drill','Ida is not in Zone Z'],
    question:'Who is in Zone X?', answer:'Jake' },
  { people:['Mara','Nick','Opal','Paul'], categoryA:['Floor A','Floor B','Floor C','Floor D'], categoryB:['Coin','Gem','Ring','Key'],
    clues:['Neither Mara nor Paul is on Floor A','Nick is not on Floor B or Floor C','Floor A has the Coin','Opal does not have the Ring','Floor D has the Ring','Mara is not on Floor D'],
    question:'Who is on Floor A?', answer:'Opal' },
  { people:['Quinn','Rosa','Seth','Tara'], categoryA:['Bay 1','Bay 2','Bay 3','Bay 4'], categoryB:['Anchor','Chain','Rope','Hook'],
    clues:['Neither Quinn nor Seth is in Bay 1','Rosa is not in Bay 2 or Bay 3','Bay 1 has the Chain','Tara does not have the Anchor','Bay 4 has the Anchor','Quinn is not in Bay 4'],
    question:'Who is in Bay 1?', answer:'Tara' },
  { people:['Uma','Vito','Wren','Xyla'], categoryA:['Deck 1','Deck 2','Deck 3','Deck 4'], categoryB:['Flag','Map','Compass','Lantern'],
    clues:['Neither Uma nor Xyla is on Deck 1','Vito is not on Deck 2 or Deck 4','Deck 1 has the Map','Wren does not have the Compass','Deck 3 has the Compass','Uma is not on Deck 3'],
    question:'Who is on Deck 1?', answer:'Wren' },
  { people:['Yara','Zane','Aria','Bram'], categoryA:['Post A','Post B','Post C','Post D'], categoryB:['Stone','Wood','Iron','Copper'],
    clues:['Neither Yara nor Bram is at Post A','Zane is not at Post B or Post C','Post A has the Iron','Aria does not have the Stone','Post D has the Stone','Yara is not at Post D'],
    question:'Who is at Post A?', answer:'Zane' },
  { people:['Cleo','Dean','Eris','Ford'], categoryA:['Wing I','Wing II','Wing III','Wing IV'], categoryB:['Vial','Chart','Badge','Key'],
    clues:['Neither Cleo nor Ford is in Wing I','Dean is not in Wing II or Wing IV','Wing I has the Badge','Eris does not have the Vial','Wing III has the Vial','Cleo is not in Wing III'],
    question:'Who is in Wing I?', answer:'Dean' },
];

export const TIME_TRACE_HARD: TimeTracePuzzle[] = [
  { slots:['10 PM','11 PM','12 AM','1 AM'], entities:['Anya','Boris','Clara','Diego'],
    clues:['Neither Anya nor Boris arrived first','Clara was not last','Diego arrived after both Anya and Boris','The crime occurred at 11 PM'],
    question:'Who was at the scene at 11 PM?', answer:'Clara' },
  { slots:['7 AM','8 AM','9 AM','10 AM'], entities:['Elsa','Felix','Gina','Hugo'],
    clues:['Hugo arrived before Felix but after Gina','Elsa was not first','Felix was not last','The incident happened at 8 AM'],
    question:'Who was present at 8 AM?', answer:'Elsa' },
  { slots:['2 PM','3 PM','4 PM','5 PM'], entities:['Ida','Jake','Kole','Lena'],
    clues:['Lena arrived last','Neither Ida nor Jake was first','Kole arrived before Ida','The event happened at 3 PM'],
    question:'Who was at the scene at 3 PM?', answer:'Jake' },
  { slots:['5 PM','6 PM','7 PM','8 PM'], entities:['Mara','Nick','Opal','Paul'],
    clues:['Paul was not first or last','Opal arrived after Mara','Nick arrived before Paul','The theft happened at 6 PM'],
    question:'Who was present at 6 PM?', answer:'Paul' },
  { slots:['11 AM','12 PM','1 PM','2 PM'], entities:['Quinn','Rosa','Seth','Tara'],
    clues:['Neither Rosa nor Tara arrived last','Quinn arrived before Seth','Rosa was not first','The disappearance happened at 12 PM'],
    question:'Who was at the scene at 12 PM?', answer:'Quinn' },
  { slots:['3 AM','4 AM','5 AM','6 AM'], entities:['Uma','Vito','Wren','Xyla'],
    clues:['Xyla was not first or second','Uma arrived before Wren','Vito was neither first nor last','The break-in happened at 4 AM'],
    question:'Who was present at 4 AM?', answer:'Uma' },
  { slots:['9 PM','10 PM','11 PM','12 AM'], entities:['Yara','Zane','Aria','Bram'],
    clues:['Neither Yara nor Bram arrived last','Zane was not first','Aria arrived before Zane','The incident happened at 10 PM'],
    question:'Who was at the scene at 10 PM?', answer:'Aria' },
  { slots:['6 AM','7 AM','8 AM','9 AM'], entities:['Cleo','Dean','Eris','Ford'],
    clues:['Ford arrived last','Neither Cleo nor Dean was second','Eris arrived before Cleo','The theft happened at 7 AM'],
    question:'Who was present at 7 AM?', answer:'Dean' },
];

export const TRUE_LIE_HARD: TrueLiePuzzle[] = [
  { statements:[{person:'Anya',text:'I was in the control room from 10 PM until midnight'},{person:'Boris',text:"Anya's card showed no entry to the control room that night"},{person:'Clara',text:'I personally saw Anya leave the control room at 11 PM'},{person:'Diego',text:"Boris is misreading the access logs"}], question:'Who is lying?', answer:'Anya' },
  { statements:[{person:'Elsa',text:'Felix was with me the entire evening'},{person:'Felix',text:'I stepped out briefly around 9 PM but Elsa knows'},{person:'Gina',text:"Elsa and Felix's accounts are inconsistent with each other"},{person:'Hugo',text:"Gina's analysis of the situation is correct"}], question:'Who is lying?', answer:'Elsa' },
  { statements:[{person:'Ida',text:"The safe was already open when I arrived"},{person:'Jake',text:'Ida arrived before the safe was opened — I watched her open it'},{person:'Kole',text:"I arrived after Ida and the safe was already open then too"},{person:'Lena',text:"Jake's timing of events is accurate"}], question:'Who is lying?', answer:'Ida' },
  { statements:[{person:'Mara',text:'Nick and I were together when the alarm went off'},{person:'Nick',text:'I was alone in the east corridor when the alarm sounded'},{person:'Opal',text:"Mara's claim about being with Nick is false — I saw Nick alone"},{person:'Paul',text:"Opal's account of what she saw matches the camera angles"}], question:'Who is lying?', answer:'Mara' },
  { statements:[{person:'Quinn',text:'The document was intact when I last checked at noon'},{person:'Rosa',text:'Quinn checked the document after 2 PM, not noon'},{person:'Seth',text:"Rosa is right — I saw Quinn with the document at 2:30 PM"},{person:'Tara',text:"Quinn's version of the timeline is accurate"}], question:'Who is lying?', answer:'Quinn' },
  { statements:[{person:'Uma',text:"Vito never had the master key"},{person:'Vito',text:'I was handed the master key by the manager at 8 AM'},{person:'Wren',text:"I witnessed Vito receive the key from the manager"},{person:'Xyla',text:"Uma's claim about the master key is correct"}], question:'Who is lying?', answer:'Uma' },
  { statements:[{person:'Yara',text:"I returned the evidence bag sealed and untouched"},{person:'Zane',text:"The evidence bag Yara returned had been opened"},{person:'Aria',text:"Yara resealed the bag before returning it — I helped her"},{person:'Bram',text:"Zane's observation about the evidence bag is accurate"}], question:'Who is lying?', answer:'Yara' },
  { statements:[{person:'Cleo',text:'Dean never accessed the restricted floor that day'},{person:'Dean',text:'My badge log will show I was nowhere near the restricted floor'},{person:'Eris',text:'I rode the elevator with Dean to the restricted floor at 3 PM'},{person:'Ford',text:"Cleo and Dean are both telling the truth about the restricted floor"}], question:'Who is lying?', answer:'Cleo' },
];

export const CODE_BREAK_HARD: CodeBreakPuzzle[] = [
  { clues:[{guess:'1357',hint:'2 correct in right place, 0 correct but wrong place'},{guess:'2468',hint:'0 correct in right place, 2 correct but wrong place'},{guess:'1946',hint:'1 correct in right place, 1 correct but wrong place'},{guess:'3750',hint:'none correct'}], answer:'1368' },
  { clues:[{guess:'2461',hint:'1 correct in right place, 1 correct but wrong place'},{guess:'8590',hint:'none correct'},{guess:'3274',hint:'2 correct in right place, 1 correct but wrong place'},{guess:'6312',hint:'0 correct in right place, 3 correct but wrong place'}], answer:'3271' },
  { clues:[{guess:'4823',hint:'2 correct in right place, 0 correct but wrong place'},{guess:'1567',hint:'none correct'},{guess:'4092',hint:'1 correct in right place, 2 correct but wrong place'},{guess:'8423',hint:'1 correct in right place, 2 correct but wrong place'}], answer:'4829' },
  { clues:[{guess:'7135',hint:'1 correct in right place, 2 correct but wrong place'},{guess:'2468',hint:'none correct'},{guess:'5731',hint:'0 correct in right place, 3 correct but wrong place'},{guess:'1375',hint:'2 correct in right place, 1 correct but wrong place'}], answer:'3175' },
  { clues:[{guess:'9182',hint:'2 correct in right place, 0 correct but wrong place'},{guess:'3456',hint:'none correct'},{guess:'9072',hint:'1 correct in right place, 2 correct but wrong place'},{guess:'1982',hint:'1 correct in right place, 2 correct but wrong place'}], answer:'9712' },
  { clues:[{guess:'6241',hint:'1 correct in right place, 1 correct but wrong place'},{guess:'7890',hint:'none correct'},{guess:'2614',hint:'0 correct in right place, 3 correct but wrong place'},{guess:'4261',hint:'2 correct in right place, 1 correct but wrong place'}], answer:'4216' },
  { clues:[{guess:'3579',hint:'1 correct in right place, 1 correct but wrong place'},{guess:'1246',hint:'none correct'},{guess:'7539',hint:'2 correct in right place, 1 correct but wrong place'},{guess:'5973',hint:'0 correct in right place, 3 correct but wrong place'}], answer:'7593' },
  { clues:[{guess:'8163',hint:'2 correct in right place, 1 correct but wrong place'},{guess:'4579',hint:'none correct'},{guess:'1863',hint:'1 correct in right place, 2 correct but wrong place'},{guess:'8613',hint:'2 correct in right place, 1 correct but wrong place'}], answer:'8163' },
];
