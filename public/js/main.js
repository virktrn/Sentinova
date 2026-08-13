const toggle =
    document.getElementById("themeToggle");

if(toggle){

    toggle.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme","dark");
        }else{
            localStorage.setItem("theme","light");
        }

    });

}