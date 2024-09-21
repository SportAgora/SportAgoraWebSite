function start(){
const input = document.getElementById("cartao_validade")

input.addEventListener('keypress', () => {
    let inputLength = input.value.length
    if (inputLength == 2) {
        input.value += '/'
    }
})
}