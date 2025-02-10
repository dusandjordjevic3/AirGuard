
function Posaljipodatke(){
// funkcija za cuvanje podataka iz forme
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // prikazi poruku da je uspelo
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');

    // resetuj formu kada se zavrsi sve 
    this.reset();
});
}