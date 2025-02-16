document.addEventListener("DOMContentLoaded", function() {

  // A. Punishment Guidelines from your screenshot.
  const punishmentGuidelines = {
    "Abuse of OOC": {
      punishments: ["2 Hour Ban", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Combat Logging/Evading Staff": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Cop Baiting": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Exploiting": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "PERM BAN"]
    },
    "Fail Roleplay (FRP)": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Failure to follow staff direction": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Forced RP/Interjection": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Greenzone Breach": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "GTA Driving": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Hacking/Modding": {
      punishments: ["PERM BAN"]
    },
    "Harassment": {
      punishments: ["24 Hour Ban", "3 Day Ban", "1 Week Ban", "PERM BAN"]
    },
    "Metagaming": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "NITRP": {
      punishments: ["Warning or Kick", "12 Hour Ban", "24 Hour Ban", "1 Week Ban"]
    },
    "No Microphone": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Priority Status Breach": {
      punishments: ["12 Hour Ban", "24 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "RDM": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Restricted Civ RP": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Sexual Remarks/Comments": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "PERM BAN"]
    },
    "Specialist Scene": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Staff Impersonation": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Toxic Behavior": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "PERM BAN"]
    },
    "Trolling": {
      punishments: ["Warning or Kick", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "VDM": {
      punishments: ["12 Hour Ban", "24 Hour Ban", "1 Day Ban", "1 Week Ban"]
    },
    "Vulgar Language": {
      punishments: ["2 Hour Ban", "12 Hour Ban", "1 Day Ban", "1 Week Ban"]
    }
  };

  // B. Offence map to unify short codes.
  const offenceMap = {
    "FAILRP": "Fail Roleplay (FRP)",
    "Priority Status Breach": "Priority Status Breach",
    "Restricted Civ RP": "Restricted Civ RP",
    "VDM": "VDM",
    "Cop Baiting": "Cop Baiting"
  };

  // C. Helper: Convert a number to its ordinal string.
  function ordinalSuffixOf(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
  }

  // D. Function to split logs into blocks.
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

  // E. Regex to capture offence lines.
  const offenceRegex = /^(.+?)\s*-\s*(\d+)(?:st|nd|rd|th)\s*Offence/i;

  // F. Main event listener
  document.getElementById("generateNextButton").addEventListener("click", function() {
    const selectedOffence = document.getElementById("offenceSelect").value; // May be empty
    const rawText = document.getElementById("punishmentText").value || "";
    const blocks = splitIntoBlocks(rawText);

    let offenceCounts = {};

    blocks.forEach(block => {
      // Skip block if it contains "Revoked by"
      if (/revoked by/i.test(block)) return;
      const blockLines = block.split("\n");
      for (let line of blockLines) {
        const match = line.match(offenceRegex);
        if (match) {
          let offenceName = match[1].trim();
          if (offenceMap[offenceName]) {
            offenceName = offenceMap[offenceName];
          }
          if (punishmentGuidelines[offenceName]) {
            if (selectedOffence) {
              if (offenceName.toLowerCase() === selectedOffence.toLowerCase()) {
                if (!offenceCounts[offenceName]) {
                  offenceCounts[offenceName] = 0;
                }
                offenceCounts[offenceName]++;
              }
            } else {
              if (!offenceCounts[offenceName]) {
                offenceCounts[offenceName] = 0;
              }
              offenceCounts[offenceName]++;
            }
          }
        }
      }
    });

    if (Object.keys(offenceCounts).length === 0) {
      document.getElementById("nextResult").innerHTML = `<p>No matching offences found (or all were revoked).</p>`;
      document.getElementById("nextResult").style.display = "block";
      return;
    }

    // Table #1: Total Breaches.
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

    // Table #2: Next Punishment (without Notes column).
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

  // G. Allow generation by pressing Enter.
  // When focus is not on the textarea, pressing Enter triggers generation.
  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.activeElement.id !== "punishmentText") {
      e.preventDefault();
      document.getElementById("generateNextButton").click();
    }
  });
  // In the textarea, allow Ctrl+Enter to generate.
  document.getElementById("punishmentText").addEventListener("keydown", function(e) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      document.getElementById("generateNextButton").click();
    }
  });
});
