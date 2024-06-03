const eligible = document.getElementById("eligible") as HTMLHeadingElement;
const balance = document.getElementById("balance") as HTMLHeadingElement;
const dropStreak = document.getElementById("dropStreak") as HTMLHeadingElement;
const claimBtn = document.getElementById("claimBtn") as HTMLButtonElement;
const revealDrop = document.getElementById("revealDrop") as HTMLButtonElement;
const infoButton = document.getElementById("infoButton") as HTMLButtonElement;
const revealContainer = document.getElementById("dropReveal") as HTMLDivElement;
const dropContainer = document.getElementById(
  "dropContainer"
) as HTMLDivElement;
const infoContainer = document.getElementById(
  "infoContainer"
) as HTMLDivElement;
const container = document.getElementById("container") as HTMLDivElement;
const chest = document.getElementById("chest") as HTMLImageElement;
const chestOpen = document.getElementById("chestOpen") as HTMLImageElement;

const updateContainer = () => {
  eligible.innerText = `You are ${
    JSON.parse(localStorage.getItem("dropEligible")!) ? "" : "not"
  } eligible for a drop!`;
  balance.innerText = `Current balance: ${(
    parseInt(localStorage.getItem("balance")!) as Number
  ).toLocaleString()} gems.`;
  dropStreak.innerText = `${
    parseInt(localStorage.getItem("dropStreak")!) === 0 ? "💀" : "🔥"
  } Drop Streak: ${localStorage.getItem("dropStreak")} days (x${(
    parseInt(localStorage.getItem("dropStreak")!) / 3 +
    1
  ).toFixed(1)})`;
  if (JSON.parse(localStorage.getItem("dropEligible")!) === true) {
    claimBtn.innerText = "Open";
    claimBtn.onclick = async () => {
      try {
        const user = await (
          await fetch(`/api/user/${localStorage.getItem("username")}`)
        ).json();
        if (user) {
          if (user.dropEligible) {
            const res = await fetch(`/api/drop/${user.name}`, {
              method: "POST",
            });
            const drop = await res.json();
            console.log(drop.dropQuality);
            let colour: string;
            if (drop.dropQuality <= 6) colour = "brown";
            else if (drop.dropQuality <= 11) colour = "orange";
            else if (drop.dropQuality <= 14) colour = "deeppink";
            else if (drop.dropQuality === 15) colour = "turquoise";
            container.style.display = "none";
            revealContainer.style.display = "block";
            revealDrop.onclick = () => {
              const glow = document.createElement("div");
              const dropText = document.createElement("h1");
              let category: string = "";
              switch (colour) {
                case "brown":
                  category = " Standard";
                  break;
                case "orange":
                  category = "n Enhanced";
                  break;
                case "deeppink":
                  category = "n Elite";
                  break;
                case "turquoise":
                  category = " Mythic";
                  break;
              }
              const vowels = ["a", "e", "i", "o", "u"];
              dropText.innerHTML = `You got a${category} drop, <br> and earned ${Math.floor(
                drop.dropGems
              )} gems!`;
              dropText.id = "dropText";
              glow.id = "glow";
              glow.style.background = colour;
              revealContainer.prepend(dropText);
              revealContainer.append(glow);
              revealDrop.style.display = "none";
              chestOpen.style.display = "block";
              chest.style.display = "none";
            };
            await checkUser();
          } else {
            createError("User ineligible for drop.");
          }
        } else {
          createError("Invalid user.");
        }
      } catch (err) {
        console.log(err);
      }
    };
  } else {
    claimBtn.innerText = "Home";
    claimBtn.onclick = async () => {
      window.location.href = "/";
    };
  }
};

// @ts-ignore
const checkUser = async () => {
  try {
    const body = {
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    };
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.status === 404) {
      localStorage.clear();
    }
    const r = await res.json();
    if (r.authenticated) {
      localStorage.setItem("email", r.email);
      localStorage.setItem("username", r.username);
      localStorage.setItem("balance", r.balance);
      localStorage.setItem("dropEligible", r.dropEligible);
      localStorage.setItem("dropStreak", r.dropStreak);
      localStorage.setItem("inventory", JSON.stringify(r.inventory));
      updateContainer();
      return true;
    } else if (r.authenticated === false) {
      localStorage.clear();
    }
  } catch (err) {
    console.log(err);
  }
};
checkUser();

// @ts-ignore
const createError = (msg: string) => {
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("errorDiv");
  errorDiv.innerHTML = `
      <h1>${msg}</h1>`;
  const btn = document.createElement("button");

  btn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  btn.onclick = () => {
    document.body.removeChild<HTMLDivElement>(errorDiv);
  };
  errorDiv.append(btn);
  document.body.append(errorDiv);
};

if (!localStorage.getItem("username")) {
  window.location.href = "/auth/";
}

if (
  localStorage.getItem("dropEligible") !== undefined &&
  localStorage.getItem("balance") !== undefined
) {
  updateContainer();
} else {
  window.location.href = "/auth/";
}

infoButton.onclick = () => {
  infoContainer.style.display =
    infoContainer.style.display === "flex" ? "none" : "flex";
  infoButton.children[0].classList.toggle("fa-circle-info");
  infoButton.children[0].classList.toggle("fa-circle-xmark");
  if (infoButton.style.color === "goldenrod") infoButton.style.color = "red";
  else if (infoButton.style.color === "red")
    infoButton.style.color = "goldenrod";
  else infoButton.style.color = "red";
  if (dropContainer.style.display === "flex")
    dropContainer.style.display = "none";
  else if (dropContainer.style.display === "none")
    dropContainer.style.display = "flex";
  else dropContainer.style.display = "none";
};