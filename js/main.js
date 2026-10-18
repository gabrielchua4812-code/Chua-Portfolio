// Gabriel Chua's Portfolio - my javascript

var searchInput = document.querySelector('.search__input[data-filter]');

if (searchInput) {
  var grid = document.querySelector(searchInput.getAttribute('data-filter'));
  var cards = grid.querySelectorAll('.card');
  var noResults = document.getElementById('no-results');

  // this function shows or hides the cards depending on what was typed
  function runFilter() {
    var q = searchInput.value.trim().toLowerCase();
    var visible = 0;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var isPlaceholder = title === '';
      var show;

      if (q === '') {
        // nothing typed so show everything
        show = true;
      } else if (isPlaceholder) {
        // placeholder cards have no title so hide them when searching
        show = false;
      } else if (title.indexOf(q) !== -1) {
        show = true;
      } else {
        show = false;
      }

      card.hidden = !show;

      if (show) {
        visible = visible + 1;
      }
    }

    // show the "no results" message if nothing matched
    if (noResults) {
      noResults.hidden = visible !== 0;
    }
  }

  // It runs the filter every time the user types
  searchInput.addEventListener('input', runFilter);
}


// BACK TO TOP BUTTON

var topBtn = document.querySelector('[data-top]');

if (topBtn) {
  topBtn.addEventListener('click', function () {
    // check if the user wants less animation
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}


// CONTACT FORM VALIDATION 

var form = document.getElementById('contact-form');

if (form) {
  var nameInput = form.querySelector('#name');
  var emailInput = form.querySelector('#email');
  var message = document.getElementById('form-message');

  // pattern to check that the email 
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // functions that return an error message, or '' if the value is ok
  var validators = {
    name: function (v) {
      if (v.trim().length === 0) {
        return 'Please enter your name.';
      }
      if (v.trim().length < 2) {
        return 'Name must be at least 2 characters.';
      }
      return '';
    },
    email: function (v) {
      if (v.trim().length === 0) {
        return 'Please enter your email.';
      }
      if (!emailPattern.test(v.trim())) {
        return 'Please enter a valid email address.';
      }
      return '';
    }
  };

  // checks one input and shows or clears its error
  function check(input, key) {
    var error = validators[key](input.value);
    var dot = document.getElementById(key + '-dot');
    var errBox = document.getElementById(key + '-error');
    var ok = error === '';

    if (ok) {
      dot.classList.add('is-valid');
      input.classList.add('is-valid');
      input.setAttribute('aria-invalid', 'false');
    } else {
      dot.classList.remove('is-valid');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
    }

    errBox.textContent = error;
    return ok;
  }

  // sets up the blur and input events for one field
  function setupField(input, key) {
    // touched is true after the user has clicked into the field and left it
    var touched = false;

    input.addEventListener('blur', function () {
      touched = true;
      check(input, key);
    });

    input.addEventListener('input', function () {
      var ok = validators[key](input.value) === '';
      var dot = document.getElementById(key + '-dot');

      if (ok) {
        dot.classList.add('is-valid');
        input.classList.add('is-valid');
      } else {
        dot.classList.remove('is-valid');
        input.classList.remove('is-valid');
      }

      // only show errors while typing if they already left the field once
      if (touched) {
        check(input, key);
      }

      // clear the message at the bottom of the form
      message.textContent = '';
      message.className = 'form-message';
    });
  }

  setupField(nameInput, 'name');
  setupField(emailInput, 'email');

  // when the form is submitted
  form.addEventListener('submit', function (e) {
    // stop the page from refreshing
    e.preventDefault();

    var nameOk = check(nameInput, 'name');
    var emailOk = check(emailInput, 'email');

    // if something is wrong, show an error and stop here
    if (!nameOk || !emailOk) {
      message.textContent = 'Please fix the highlighted fields and try again.';
      message.className = 'form-message is-error';

      // put the cursor on the first field that has a problem
      if (nameOk) {
        emailInput.focus();
      } else {
        nameInput.focus();
      }
      return;
    }

    // build the email text
    var reason = form.querySelector('#reason').value.trim();
    if (reason === '') {
      reason = '(none given)';
    }

    var body = 'Name: ' + nameInput.value.trim() +
               '\nEmail: ' + emailInput.value.trim() +
               '\n\nReason:\n' + reason;

    var href = 'mailto:gabrielchua4812@gmail.com' +
               '?subject=' + encodeURIComponent('Portfolio inquiry from ' + nameInput.value.trim()) +
               '&body=' + encodeURIComponent(body);

    message.textContent = 'Thanks, ' + nameInput.value.trim() + '! Opening your email app to send the message...';
    message.className = 'form-message is-success';

    // open the email app, then clear the form
    window.location.href = href;
    form.reset();

    // reset the green dots, borders and errors for both fields
    var keys = ['name', 'email'];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var input = form.querySelector('#' + key);

      document.getElementById(key + '-dot').classList.remove('is-valid');
      input.classList.remove('is-valid');
      input.removeAttribute('aria-invalid');
      document.getElementById(key + '-error').textContent = '';
    }
  });
}
