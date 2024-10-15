var cores_claro = [
    ["--verde_especial","#339933"],
    ["--preto", "#1b1b1b"],
    ["--branco", "white"],
    ["--brancobg", "#ffffff"],
    ["--cinza","gray"],
    ["--cinzaclaro","#ccc"],
    ["--cordefundopadrao","#f0f0f0"],
    ["--verdenavfooter","#2a8d3f"],
    ["--verdeneon","#42ff21"],
    ["--brancofraco","#f1f1f1"],
    ["--postcor", "white"],
    ["--textopost", "#333"],
    ["--textopostinfo", "#777"],
    ["--hoverplanos", "#cdf7cf"]
]
  
var cores_escuro = [
    ["--verde_especial","#339933"],
    ["--preto", "#1b1b1b"],
    ["--branco", "white"],
    ["--brancobg", "#ffffff"],
    ["--cinza","gray"],
    ["--cinzaclaro","#ccc"],
    ["--cordefundopadrao","#0d0d0d"],
    ["--verdenavfooter","#2a8d3f"],
    ["--verdeneon","#42ff21"],
    ["--brancofraco","#f1f1f1"],
    ["--postcor", "#373434"],
    ["--textopost", "white"],
    ["--textopostinfo", "white"],
    ["--hoverplanos", "#1f2e20"]
]
function loadMode() {
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        setDarkMode();
    }
    document.getElementById('toggleMode').addEventListener('click', toggleMode);
  }
  
  // set darkmode
  function setDarkMode() {
    let actual_color = 0
    for(i = cores_escuro.length; i > 0; i--){
        document.documentElement.style.setProperty(cores_escuro[actual_color][0], cores_escuro[actual_color][1]);
        actual_color += 1
    }
    localStorage.setItem('mode', 'dark');
  }
  
  // set lightmode
  function setLightMode() {
    let actual_color = 0
    for(i = cores_claro.length; i > 0; i--){
        document.documentElement.style.setProperty(cores_claro[actual_color][0], cores_claro[actual_color][1]);
        actual_color += 1
    }
    localStorage.setItem('mode', 'light');
  }
  
  // toggle the color mode
  function toggleMode() {
    const isDarkMode = localStorage.getItem('mode') === 'dark';
    if (isDarkMode) {
        setLightMode();
    } else {
        setDarkMode();
    }
  }
  window.onload = loadMode()
