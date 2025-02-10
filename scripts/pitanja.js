// Funkcija kako se prikazuje sledece pitanje
function nextQuestion(questionNumber) {
    // sakrij trenutno pitanje
    document.getElementById("question-" + questionNumber).classList.add("hidden");
    
    // prikazi sledece pitanje
    if (questionNumber < 5) {
        document.getElementById("question-" + (questionNumber + 1)).classList.remove("hidden");
    } else {
        // poslednje pitanje, procesuiraj rezultate
        showResults();
    }
}

// Funkcija za racunanje i prikaz rezultata
function showResults() {
    let score = 0;
    let totalQuestions = 5;
    
    // proveri rezultate
    if (document.getElementById("a1").checked) score++;
    if (document.getElementById("a2").checked) score++;
    if (document.getElementById("a3").checked) score++;
    if (document.getElementById("c4").checked) score++;
    if (document.getElementById("a5").checked) score++;
    
    // prikazi rezultate
    const resultsDiv = document.getElementById("results");
    resultsDiv.classList.remove("hidden");
    resultsDiv.innerHTML = `Osvojili ste ${score} od mogućih ${totalQuestions} boda!`;

    // prikazi objasnjenja rezultata
document.getElementById("answer-explanations").classList.remove("hidden");
}