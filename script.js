document.addEventListener("DOMContentLoaded", function() {

  // A. Punishment Guidelines (updated to match your latest reference).
  //    If an offence has fewer tiers than 4, we repeat the final punishment for subsequent offences.
  const punishmentGuidelines = {
    "Abuse of OOC": {
      punishments: ["Warning/Kick", "2 hour ban", "12 hour ban", "24 hour ban"]
    },
    "Combat Logging/Evading Staff": {
      punishments: ["2 hour ban", "12 hour ban", "72 hour ban", "1 week ban"]
    },
    "Cop Baiting": {
      punishments: ["Warning/Kick", "2 hour ban", "12 hour ban", "1 week ban"]
    },
    "Exploiting": {
      punishments: ["Warning/Kick", "Permanent Ban"] // Exceeding 2 => Permanent Ban repeated
    },
    "Fail Roleplay (FRP)": {
      punishments: ["Warning/Kick", "2 hour ban", "12 hour ban", "1 week ban"]
    },
    "Failure to follow staff direction": {
      punishments: ["Warning/Kick", "1 Day Ban", "1 week ban", "Permanent Ban"]
    },
    "Forced RP/Interjection": {
      punishments: ["Warning/Kick", "12 hour ban", "72 hour ban", "1 week ban"]
    },
    "Greenzone Breach": {
      punishments: ["Warning/Kick", "2 hour ban", "12 hour ban", "1 week ban"]
    },
    "GTA Driving": {
      punishments: ["Warning/Kick", "12 hour ban", "72 hour ban", "1 week ban"]
    },
    "Hacking/Modding": {
      punishments: ["Permanent Ban"] // Only 1 tier
    },
    "Harassment": {
      punishments: ["12 hour ban", "24 hour ban", "72 hour ban", "Permanent ban"]
    },
    "Metagaming": {
      punishments: ["12 hour ban", "1 week ban", "Permanent ban"] // 3 tiers; 4th+ => Permanent ban
    },
    "NITRP": {
      punishments: ["Warning/Kick", "2 hour ban", "12 hour ban", "24 hour ban"]
    },
    "No Microphone": {
      punishments: ["Kick", "Kick", "2 hour ban", "24 hour ban"]
    },
    "Priority Status Breach": {
      punishments: ["Warning/Kick", "2 hour ban", "12 hour ban", "1 week ban"]
    },
    "RDM": {
      punishments: ["Warning/Kick", "12 hour ban", "72 hour ban", "1 week ban"]
    },
    "Restricted Civ RP": {
      punishments: ["Warning/kick", "2 hour ban", "12 hour ban", "24 hour ban"]
    },
    "Sexual Remarks/Comments": {
      punishments: ["24 hour ban", "Permanent ban"] // 3rd+ => Permanent ban
    },
    "Specialist Scene": {
      punishments: ["Warning/kick", "2 hour ban", "12 hour ban", "1 week ban"]
    },
    "Staff Impersonation": {
      punishments: ["24 hour ban", "Permanent ban"] // 3rd+ => Permanent ban
    },
    "Toxic Behavior": {
      punishments: ["2 hour ban", "12 hour ban", "72 hour ban", "Permanent ban"]
    },
    "Trolling": {
      punishments: ["Warning/Kick", "2 hour ban", "12 hour ban", "1 week ban"]
    },
    "VDM": {
      punishments: ["Warning/kick", "12 hour ban", "72 hour ban", "1 week ban"]
    },
    "Vulgar Language": {
      punishments: ["2 hour ban", "12 hour ban", "1 week ban", "Permanent ban"]
    }
  };

  // B. Offence map (short codes -> full offence name).
  const offenceMap = {
    "FAILRP": "Fail Roleplay (FRP)",
    "Priority Status Breach": "Priority Status Breach",
    "Restricted Civ RP": "Restricted Civ RP",
    "VDM": "VDM",
    "Cop Baiting": "Cop Baiting"
    // Add others if needed
  };

  // C. Helper: Convert a number to its ordinal string (e.g., 2 => "2nd")
  function ordinalSuffixOf(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
  }

  // D. Function to split logs into blocks.
  //    Each block starts with "BANNED by" or "KICKED by".
  function splitIntoBlocks(text) {
    const lines = text.split("\n");
    let blocks = [];
    let currentBlock = [];

    const blockStartRegex = /^(BANNED|KICKED)\s+by\s+/i;

    for (let line of lines) {
      if (blockStartRegex.test(line) && currentBlock.length > 0) {
        blocks.push(currentBlock.join("\n"));
        currentBlock = [];
      }
      currentBlock.push(line);
    }
    if (currentBlock.length > 0) {
      blocks.push(currentBlock.join("\n"));
    }
    return blocks;
  }

  // E. Regex to capture lines like: "<Offence> - <number><suffix> Offence"
  const offenceRegex = /^(.+?)\s*-\s*(\d+)(?:st|nd|rd|th)\s*Offence/i;

  // F. Main logic
  document.getElementById("generateNextButton").addEventListener("click", function() {
    const selectedOffence = document.getElementById("offenceSelect").value; // May be empty
    const rawText = document.getElementById("punishmentText").value || "";
    const blocks = splitIntoBlocks(rawText);

    let offenceCounts = {};

    blocks.forEach(block => {
      // Skip entire block if it contains "Revoked by"
      if (/revoked by/i.test(block)) return;
      const blockLines = block.split("\n");
      for (let line of blockLines) {
        const match = line.match(offenceRegex);
        if (match) {
          let offenceName = match[1].trim();
          // Unify short code to full name if needed
          if (offenceMap[offenceName]) {
            offenceName = offenceMap[offenceName];
          }
          // Only tally if in guidelines
          if (punishmentGuidelines[offenceName]) {
            // If user selected a specific offence, only tally that one
            if (selectedOffence) {
              if (offenceName.toLowerCase() === selectedOffence.toLowerCase()) {
                if (!offenceCounts[offenceName]) {
                  offenceCounts[offenceName] = 0;
                }
                offenceCounts[offenceName]++;
              }
            } else {
              // No filter => tally all offences
              if (!offenceCounts[offenceName]) {
                offenceCounts[offenceName] = 0;
              }
              offenceCounts[offenceName]++;
            }
          }
        }
      }
    });

    // If no offences found
    if (Object.keys(offenceCounts).length === 0) {
      document.getElementById("nextResult").innerHTML = `<p>No matching offences found (or all were revoked).</p>`;
      document.getElementById("nextResult").style.display = "block";
      return;
    }

    // Table #1 => total breaches
    let tableBreaches = `<table>
      <thead>
        <tr>
          <th>Offence Type</th>
          <th>Total Breaches</th>
        </tr>
      </thead>
      <tbody>`;
    for (const offence in offenceCounts) {
      tableBreaches += `<tr>
        <td>${offence}</td>
        <td>${offenceCounts[offence]}</td>
      </tr>`;
    }
    tableBreaches += `</tbody></table>`;

    // Table #2 => next punishment
    let tableNext = `<table>
      <thead>
        <tr>
          <th>Offence Type</th>
          <th>Next Offence</th>
          <th>Suggested Punishment</th>
        </tr>
      </thead>
      <tbody>`;
    for (const offence in offenceCounts) {
      const guidelines = punishmentGuidelines[offence];
      if (!guidelines) continue;
      const punishments = guidelines.punishments;
      const timesSoFar = offenceCounts[offence];
      // Next index = timesSoFar (0-based). If it exceeds array length, use last.
      const nextIndex = timesSoFar;
      const nextPunishment = nextIndex < punishments.length
        ? punishments[nextIndex]
        : punishments[punishments.length - 1];
      const nextOrdinal = ordinalSuffixOf(timesSoFar + 1);
      tableNext += `<tr>
        <td>${offence}</td>
        <td>${nextOrdinal} offence</td>
        <td>${nextPunishment}</td>
      </tr>`;
    }
    tableNext += `</tbody></table>`;

    const resultHTML = `
      <h3>Total Breaches</h3>
      ${tableBreaches}
      <h3>Next Punishment</h3>
      ${tableNext}
    `;

    document.getElementById("nextResult").innerHTML = resultHTML;
    document.getElementById("nextResult").style.display = "block";
  });

  // G. Optional: Press Enter or Ctrl+Enter to generate
  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.activeElement.id !== "punishmentText") {
      e.preventDefault();
      document.getElementById("generateNextButton").click();
    }
  });
  document.getElementById("punishmentText").addEventListener("keydown", function(e) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      document.getElementById("generateNextButton").click();
    }
  });
});
