import React, { useEffect, useMemo, useState } from "react";

const TRIAGE_OPTIONS = [
  "Send Home with Meds",
  "Urgent Care",
  "Emergency Room",
  "ICU",
];

const TRIAGE_RANK = {
  "Send Home with Meds": 0,
  "Urgent Care": 1,
  "Emergency Room": 2,
  ICU: 3,
};

const TRIAGE_COST = {
  "Send Home with Meds": 150,
  "Urgent Care": 800,
  "Emergency Room": 9000,
  ICU: 90000,
};

const CORRECT_ROASTS = [
  "Correct. Don't let it go to your head.",
  "Right answer, wrong energy, but we'll take it.",
  "Congrats, you're basically the next Dr. Oz.",
  "You were correct. Please act less proud.",
  "Nice job. The bar was underground and you still cleared it.",
];

const CASES = [
  {
    name: "Mike",
    age: "45M",
    intro: '"Ate a big burrito 2 hours ago, probably heartburn."',
    complaint: "Crushing chest pain",
    symptoms: ["Sweating", "Left arm tingling", "Looks very not-burrito-related"],
    labs: ["EKG shows ST elevation"],
    acceptable: ["Emergency Room"],
    ideal: "Emergency Room",
    deathChoices: ["Send Home with Meds", "Urgent Care"],
    deathText:
      "Mike is dead. That wasn't heartburn. That was his heart saying goodbye.",
    optionRoasts: {
      ICU: "Technically correct but you burned $80k on a guy who needed a cath lab, not a ventilator.",
    },
    silhouette: { head: "rounded-full", body: "rounded-3xl", scale: "scale-105", accent: "bg-rose-200" },
  },
  {
    name: "Brittany",
    age: "19F",
    intro: '"Has a stats exam tomorrow, drinks 6 Red Bulls daily."',
    complaint: "Heart racing",
    symptoms: ["Can't breathe", "Tingling fingers", "Crying"],
    labs: ["HR 112", "O2 99%", "EKG normal"],
    acceptable: ["Send Home with Meds"],
    ideal: "Send Home with Meds",
    deathChoices: [],
    optionRoasts: {
      "Urgent Care": "Reasonable-ish, but you sent caffeine panic to a strip mall annex. Bold.",
      "Emergency Room": "You activated expensive feelings management. The accountants are sobbing now too.",
      ICU: "Congrats you admitted a panic attack to the ICU. Brittany failed her exam AND you failed this one.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[2rem]", scale: "scale-95", accent: "bg-sky-200" },
  },
  {
    name: "Dave",
    age: "35M",
    intro: '"My wife made me come in."',
    complaint: "Minor hand laceration from cooking",
    symptoms: ["Band-aid already on it", "Vitals perfect", "Looks embarrassed"],
    labs: [],
    acceptable: ["Urgent Care"],
    ideal: "Urgent Care",
    deathChoices: [],
    optionRoasts: {
      "Send Home with Meds": "Honestly he was halfway home already. You barely participated.",
      "Emergency Room": "You used a trauma bay for a paper cut. Dave's wife is still annoyed. Nothing changed.",
      ICU: "You used a trauma bay for a paper cut. Dave's wife is still annoyed. Nothing changed.",
    },
    silhouette: { head: "rounded-full", body: "rounded-2xl", scale: "scale-100", accent: "bg-slate-300" },
  },
  {
    name: "Linda",
    age: "52F",
    intro: '"I get migraines all the time, this one feels different."',
    complaint: "Sudden onset worst headache of her life",
    symptoms: ["Stiff neck", "Photophobia"],
    labs: ["BP 170/100"],
    acceptable: ["ICU"],
    ideal: "ICU",
    deathChoices: ["Send Home with Meds"],
    deathText:
      "Linda has a subarachnoid hemorrhage. She did not make it home. You killed a woman for saying she gets migraines.",
    optionRoasts: {
      "Urgent Care": "You sent a thunderclap headache to urgent care. That's not triage, that's outsourcing guilt.",
      "Emergency Room": "Close, but she needs the unit upstairs where alarms go to scream.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[2.2rem]", scale: "scale-100", accent: "bg-rose-100" },
  },
  {
    name: "Frank",
    age: "67M",
    intro: '"He comes in every week, always fine, smells like a brewery."',
    complaint: "Chest pain",
    symptoms: ["Slurred speech", "Regular visitor"],
    labs: ["NEW EKG changes", "Troponin elevated"],
    acceptable: ["Emergency Room"],
    ideal: "Emergency Room",
    deathChoices: ["Send Home with Meds"],
    deathText:
      "Frank was crying wolf for 6 months. Today the wolf was real. Frank is dead. You learned nothing from Aesop.",
    optionRoasts: {
      "Urgent Care": "You saw positive troponins and chose retail medicine. Deeply unsettling.",
      ICU: "Not wildly wrong, just wildly expensive.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[2.4rem]", scale: "scale-110", accent: "bg-amber-100" },
  },
  {
    name: "Emma",
    age: "3F",
    intro: `"She won't stop crying, mom is panicking."`,
    complaint: "Fever 103",
    symptoms: ["Pulling at ear", "Fussy", "Eating fine"],
    labs: ["WBC mildly elevated"],
    acceptable: ["Send Home with Meds", "Urgent Care"],
    ideal: "Send Home with Meds",
    deathChoices: [],
    optionRoasts: {
      "Send Home with Meds": "Correct. Tiny ear, tiny crisis.",
      "Urgent Care": "Acceptable. Everyone survives, including your conscience.",
      "Emergency Room": "You lit up the ER for an ear infection. The nurses are making a group chat about you.",
      ICU: "You admitted a toddler with an ear infection to the ICU. Emma is fine. Her mom is traumatized. You owe someone a therapy copay.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[1.8rem]", scale: "scale-75", accent: "bg-pink-200" },
  },
  {
    name: "Chad",
    age: "28M",
    intro: '"Just crushed leg day, probably sore."',
    complaint: "Dark brown urine",
    symptoms: ["Severe muscle pain", "Hadn't drunk water in 2 days"],
    labs: ["Creatinine 4.2", "CK through the roof"],
    acceptable: ["Emergency Room", "ICU"],
    ideal: "Emergency Room",
    deathChoices: ["Send Home with Meds"],
    deathText:
      "Chad's kidneys have left the chat. Rhabdo is not a vibe, it's a medical emergency.",
    optionRoasts: {
      "Urgent Care": "You sent imminent kidney betrayal to urgent care. Fascinating choice.",
      "Emergency Room": "Correct. His urine is cola, not a personality.",
      ICU: "Also acceptable. You're dramatic, but at least Chad keeps both kidneys on paper.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[2.5rem]", scale: "scale-110", accent: "bg-blue-200" },
  },
  {
    name: "Dorothy",
    age: "78F",
    intro: `"She's always a little confused, totally normal for her."`,
    complaint: "Family brought her in",
    symptoms: ["Mild confusion", "Warm skin"],
    labs: ["BP 82/50", "HR 124", "WBC 18k", "Lactate elevated"],
    acceptable: ["ICU"],
    ideal: "ICU",
    deathChoices: ["Send Home with Meds"],
    deathText:
      "Dorothy had sepsis. Dorothy did not go home. You sent a septic 78 year old home because her family said she was always weird. Incredible.",
    optionRoasts: {
      "Urgent Care": "You sent septic shock to urgent care. The clipboard there isn't fixing this.",
      "Emergency Room": "Better, but she needs tubes, pressors, and a lot more panic.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[2.3rem]", scale: "scale-90", accent: "bg-violet-100" },
  },
  {
    name: "Gerald",
    age: "42M",
    intro: '"WebMD told me I have 14 conditions."',
    complaint: "Chest tightness",
    symptoms: [
      "Self-diagnosed with everything",
      "Brought printed articles",
      "Vitals perfect",
      "Been here 4 times this month",
    ],
    labs: ["Normal labs"],
    acceptable: ["Send Home with Meds"],
    ideal: "Send Home with Meds",
    deathChoices: [],
    optionRoasts: {
      "Urgent Care": "You referred browser anxiety to a smaller building. Inspirational.",
      "Emergency Room": "You rewarded WebMD with hospital resources. The internet wins again.",
      ICU: "Gerald does not have 14 conditions. Gerald has anxiety and a wifi connection. You just gave him validation and a $90k bill.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[2rem]", scale: "scale-100", accent: "bg-emerald-100" },
  },
  {
    name: "Ashley",
    age: "22F",
    intro: '"Probably just period cramps."',
    complaint: "Right lower quadrant pain",
    symptoms: ["Nausea", "Fever 101", "Pain worse with movement"],
    labs: ["WBC 14k", "Rebound tenderness noted"],
    acceptable: ["Emergency Room"],
    ideal: "Emergency Room",
    deathChoices: ["Send Home with Meds"],
    deathText:
      "Ashley's appendix ruptured in the parking lot. She said it was probably cramps. It was not cramps.",
    optionRoasts: {
      "Urgent Care": "You sent probable appendicitis to urgent care. Hope they enjoy surprise surgery referrals.",
      ICU: "Overkill, but at least the appendix loses this round.",
    },
    silhouette: { head: "rounded-full", body: "rounded-[2rem]", scale: "scale-95", accent: "bg-red-100" },
  },
];

const MALPRACTICE_COST = 275000;
const TIMER_SECONDS = 10;
const FEEDBACK_MS = 2400;

const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

function CartoonPatient({ patient }) {
  return (
    <div className="relative flex h-64 items-end justify-center rounded-[2rem] border border-slate-200 bg-gradient-to-b from-white to-sky-50 p-6 shadow-inner">
      <div className="absolute left-5 top-5 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-700">
        Waiting Room Chaos
      </div>
      <div className={`relative ${patient.silhouette.scale}`}>
        <div className={`mx-auto h-16 w-16 border-4 border-slate-700 ${patient.silhouette.head} ${patient.silhouette.accent}`} />
        <div className={`mx-auto mt-3 h-28 w-28 border-4 border-slate-700 bg-white ${patient.silhouette.body}`} />
        <div className="absolute left-[-1.25rem] top-[4.8rem] h-4 w-12 rounded-full border-4 border-slate-700 bg-white" />
        <div className="absolute right-[-1.25rem] top-[4.8rem] h-4 w-12 rounded-full border-4 border-slate-700 bg-white" />
        <div className="absolute left-5 top-[9.8rem] h-14 w-4 rounded-full border-4 border-slate-700 bg-white" />
        <div className="absolute right-5 top-[9.8rem] h-14 w-4 rounded-full border-4 border-slate-700 bg-white" />
      </div>
      <div className="absolute bottom-4 rounded-full bg-slate-900/5 px-4 py-2 text-xs font-semibold text-slate-500">
        Cartoon likeness only. Lawsuit-proof, unlike your decisions.
      </div>
    </div>
  );
}

export default function App() {
  const [patientIndex, setPatientIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [livesSaved, setLivesSaved] = useState(0);
  const [moneyWasted, setMoneyWasted] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [quit, setQuit] = useState(false);
  const [usedChoices, setUsedChoices] = useState([]);

  const patient = CASES[patientIndex];

  const progressLabel = useMemo(
    () => `${Math.min(patientIndex + 1, CASES.length)}/${CASES.length}`,
    [patientIndex]
  );

  useEffect(() => {
    if (gameOver || quit || feedback) return undefined;

    if (timeLeft <= 0) {
      const wrongChoices = TRIAGE_OPTIONS.filter(
        (option) => !patient.acceptable.includes(option)
      );
      const randomWrong = pickRandom(wrongChoices);
      resolveChoice(randomWrong, true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [timeLeft, feedback, gameOver, quit, patient]);

  const restartGame = () => {
    setPatientIndex(0);
    setTimeLeft(TIMER_SECONDS);
    setLivesSaved(0);
    setMoneyWasted(0);
    setFeedback(null);
    setGameOver(false);
    setQuit(false);
    setUsedChoices([]);
  };

  const finishGame = () => {
    setGameOver(true);
    setFeedback(null);
  };

  const goNext = () => {
    if (patientIndex >= CASES.length - 1) {
      finishGame();
      return;
    }
    setPatientIndex((value) => value + 1);
    setTimeLeft(TIMER_SECONDS);
    setFeedback(null);
  };

  const resolveChoice = (choice, timedOut = false) => {
    if (feedback || gameOver || quit) return;

    const isAcceptable = patient.acceptable.includes(choice);
    const idealRank = TRIAGE_RANK[patient.ideal];
    const choiceRank = TRIAGE_RANK[choice];
    const overtriage = choiceRank > idealRank;
    const undertriage = choiceRank < idealRank;
    const fatalUndertriage = patient.deathChoices.includes(choice);

    let moneyDelta = 0;
    let savedDelta = 0;
    let roast = "";

    if (isAcceptable) {
      savedDelta = 1;
      roast =
        patient.optionRoasts[choice] || pickRandom(CORRECT_ROASTS);
      if (overtriage) {
        moneyDelta = TRIAGE_COST[choice] - TRIAGE_COST[patient.ideal];
      }
    } else if (fatalUndertriage) {
      roast = patient.deathText;
      moneyDelta = MALPRACTICE_COST;
    } else {
      roast =
        patient.optionRoasts[choice] ||
        (undertriage
          ? "Wrong and dangerously optimistic. A terrible combo."
          : "Wrong, expensive, and somehow still confident.");
      if (overtriage) {
        moneyDelta = TRIAGE_COST[choice] - TRIAGE_COST[patient.ideal];
      }
    }

    if (timedOut) {
      roast = `You froze, the clock picked "${choice}" for you, and somehow that made things worse. ${roast}`;
    }

    setLivesSaved((value) => value + savedDelta);
    setMoneyWasted((value) => value + moneyDelta);
    setUsedChoices((value) => [...value, { patient: patient.name, choice, savedDelta, moneyDelta }]);
    setFeedback({
      title: isAcceptable ? "Patient Mostly Survived" : "Administrative Disaster",
      choice,
      roast,
      savedDelta,
      moneyDelta,
      timedOut,
    });

    window.setTimeout(goNext, FEEDBACK_MS);
  };

  const getFinalMessage = () => {
    if (livesSaved === 10 && moneyWasted >= 200000) {
      return "You saved everyone but bankrupted the hospital. The ICU is now a Panera Bread.";
    }
    if (livesSaved === 10 && moneyWasted < 200000) {
      return "You're annoyingly good at this. Please never actually practice medicine, you'd make the rest of us look bad.";
    }
    if (livesSaved >= 8) {
      return "Not bad. A couple people died but statistically that happens anyway.";
    }
    if (livesSaved >= 5) {
      return "Half your patients survived. Glass half full. The other glass is a malpractice suit.";
    }
    return "You are a menace. Multiple families are grieving. Please return to the waiting room.";
  };

  if (quit) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-sky-700">Shift Ended</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">You left the ER.</h1>
          <p className="mt-4 text-lg text-slate-600">
            Honestly, probably your best clinical decision all day.
          </p>
          <button
            onClick={restartGame}
            className="mt-8 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_45%,_#fee2e2)] px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-rose-600">Triage Complete</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">Your Shift Report Card</h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">{getFinalMessage()}</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-900 px-5 py-4 text-white shadow-lg">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Final Damage</div>
              <div className="mt-2 text-3xl font-black">{livesSaved}/10</div>
              <div className="text-sm text-slate-300">Lives Saved</div>
              <div className="mt-3 text-2xl font-black text-rose-300">{currency(moneyWasted)}</div>
              <div className="text-sm text-slate-300">Money Wasted</div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button
              onClick={restartGame}
              className="rounded-2xl bg-sky-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-sky-500"
            >
              Play Again
            </button>
            <button
              onClick={() => setQuit(true)}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-lg font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Quit
            </button>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Decision Trail</p>
            <div className="mt-4 grid gap-2">
              {usedChoices.map((entry) => (
                <div
                  key={`${entry.patient}-${entry.choice}`}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm shadow-sm"
                >
                  <span className="font-semibold text-slate-700">
                    {entry.patient}: {entry.choice}
                  </span>
                  <span className={entry.savedDelta ? "font-bold text-emerald-600" : "font-bold text-rose-600"}>
                    {entry.savedDelta ? "+1 life" : "0 lives"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_38%,_#fee2e2)] px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/80 px-6 py-5 shadow-lg backdrop-blur">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-sky-700">ER Triage Game</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Pick fast, regret faster.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Lives Saved</div>
              <div className="text-2xl font-black text-emerald-800">{livesSaved}/10</div>
            </div>
            <div className="rounded-2xl bg-rose-50 px-4 py-3 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">Money Wasted</div>
              <div className="text-2xl font-black text-rose-800">{currency(moneyWasted)}</div>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Countdown</div>
              <div className={`text-2xl font-black ${timeLeft <= 3 ? "text-rose-300" : "text-white"}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.15fr]">
          <CartoonPatient patient={patient} />

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">
                  Patient {progressLabel}
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-tight">
                  {patient.name}, {patient.age}
                </h2>
                <p className="mt-3 text-lg text-slate-600">{patient.intro}</p>
              </div>
              <div className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700">
                {patient.complaint}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Symptoms</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {patient.symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-rose-50 p-4">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-500">Labs</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {patient.labs.length ? (
                    patient.labs.map((lab) => (
                      <span
                        key={lab}
                        className="rounded-full border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                      >
                        {lab}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500">
                      No dramatic labs. Yet.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">Choose Their Fate</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {TRIAGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => resolveChoice(option)}
                    disabled={Boolean(feedback)}
                    className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-left text-base font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {feedback && (
              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-900 p-5 text-white shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
                      {feedback.title}
                    </p>
                    <h3 className="mt-2 text-2xl font-black">{feedback.choice}</h3>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
                    {feedback.savedDelta ? "+1 life" : "+0 lives"} / {currency(feedback.moneyDelta)} damage
                  </div>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-slate-100">{feedback.roast}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
