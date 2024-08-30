const dropdown = document.querySelector(".dropdown-content");
const cityInput = document.querySelector(".searchInput");

cityInput.addEventListener("mouseover",()=>{
    dropdown.style.display = "block";
})



cityInput.addEventListener("mouseout",()=>{
    setTimeout(()=>{
        dropdown.style.display = "none";
    },4000);
    
})