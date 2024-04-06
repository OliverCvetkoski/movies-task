$(document).ready(function () {
  // Fetching movies from TVmaze API
  function fetchMovies(genre) {
    const movieContainer = $("#movieContainer").empty();
    $.ajax({
      url: "https://api.tvmaze.com/shows",
      method: "GET",
      success: function (response) {
        response.forEach((movie) => {
          if (!genre || movie.genres.includes(genre)) {
            const { name, image, summary, premiered, genres } = movie;
            const movieCard = `
                <div class="card">
                    <img src="${
                      image.medium
                    }" class="card-img-top" alt="${name}">
                    <div class="card-body">
                        <h2 class="card-title">${name}</h2>
                        <p class="card-description" style="display:none;">${stripHtmlTags(
                          summary
                        )}</p> 
                        <h3 class="card-info">Year: ${
                          premiered.split("-")[0]
                        }</h3>
                        <h3 class="card-info">Genre: ${genres.join(", ")}</h3>
                    </div>
                </div>`;
            movieContainer.append(movieCard);
          }
        });
      },
      error: function (error) {
        console.log("Error fetching movies:", error);
      },
    });
  }

  // Call fetchMovies function to display movies on page load
  fetchMovies();

  $("#genreSelect").change(function () {
    fetchMovies($(this).val());
  });

  function stripHtmlTags(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function showModal(title, description, year, genre) {
    $("#modalTitle").text(title);
    $("#modalDescription").text(description);
    $("#modalYear").text(year);
    $("#modalGenre").text(genre);
    $("#movieModal").show();
  }

  // Event listener for clicking on movie cards
  $(document).on("click", ".card", function () {
    const $card = $(this);
    const movieTitle = $card.find(".card-title").text().trim();
    const movieDescription = $card.find(".card-description").text().trim();
    const movieYear = $card.find(".card-info").eq(0).text().trim();
    const movieGenre = $card.find(".card-info").eq(1).text().trim();
    showModal(movieTitle, movieDescription, movieYear, movieGenre);
  });

  // Event listener for clicking on the close button and outside of the modal
  $(".close, #movieModal").on("click", hideModal);

  function hideModal() {
    $("#movieModal").hide();
  }
});

$(document).ready(function () {
  // Function to fetch and append quote from the API
  function fetchQuote() {
    $.get("https://quoteapi.pythonanywhere.com/random")
      .done((response) => {
        const { quote, author } = response.Quotes[0];
        $(".quoteText").text(`"${quote}" - ${author}`);
      })
      .fail((error) => {
        console.log("Error fetching quote:", error);
      });
  }

  fetchQuote();
  $(".btn").click(fetchQuote);
});

$(document).ready(function () {
  // Function to validate movie title
  function validateTitle(title) {
    if (title.length === 0 || title.length > 250) {
      $("#titleError").text("Title must be between 1 and 250 characters");
      return false;
    }
    $("#titleError").text("");
    return true;
  }

  // Function to validate date format
  function validateDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      $("#dateError").text("Date must be in YYYY-MM-DD format");
      return false;
    }
    $("#dateError").text("");
    return true;
  }

  // Function to validate description
  function validateDescription(description) {
    if (description.length === 0 || description.length > 500) {
      $("#descriptionError").text(
        "Description must be between 1 and 500 characters"
      );
      return false;
    }
    $("#descriptionError").text("");
    return true;
  }

  // Event listener for form submission
  $("#addMovieForm").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    var title = $("#title").val().trim();
    var date = $("#date").val().trim();
    var description = $("#description").val().trim();

    // Validate form inputs
    var validTitle = validateTitle(title);
    var validDate = validateDate(date);
    var validDescription = validateDescription(description);

    // If all inputs are valid, add the movie to the page
    if (validTitle && validDate && validDescription) {
      var movieCard = `
          <div class="card">
            <h3 class="card-title">${title}</h3>
            <p class="card-info">Date: ${date}</p>
            <p class="card-description">Description: ${description}</p>
          </div>`;
      $("#movieList").append(movieCard);

      // Reset form inputs
      $("#title").val("");
      $("#date").val("");
      $("#description").val("");
    }
  });
});
