---
---

// home.js
const creditCards = [
    {% for credit_card in site.data.credit_cards %}{
        "id": "{{ credit_card.id }}",
        "statement_date": {{ credit_card.statement_date }},
        "payment_date": {% if credit_card.payment_date %}{{ credit_card.payment_date }}{% else %}null{% endif %},
        "interest_free_period": {% if credit_card.interest_free_period %}{{ credit_card.interest_free_period }}{% else %}null{% endif %},
        "disabled": {% if credit_card.disabled %}true{% else %}false{% endif %}
    }{% unless forloop.last %},
    {% endunless %}{% endfor %}
];

var maxInterestFreePeriodCard = {
    "id": null,
    "max_interest_free_period": 0
};
for (var i in creditCards) {
    var creditCard = creditCards[i];
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let currentDay = new Date().getDate();
    let today = new Date(currentYear, currentMonth, currentDay);
    let currentStatementDate = null;
    let currentPaymentDate = null;
    let maxInterestFreePeriod = 0;
    if (creditCard.interest_free_period) {
        if (currentDay > creditCard.statement_date) {
            if (currentMonth == 11) {
                currentStatementDate = new Date(currentYear + 1, 0, creditCard.statement_date);
            } else {
                currentStatementDate = new Date(currentYear, currentMonth + 1, creditCard.statement_date);
            };
        } else {
            currentStatementDate = new Date(currentYear, currentMonth, creditCard.statement_date);
        };
        maxInterestFreePeriod = Math.floor((currentStatementDate - today) / 86400000) + creditCard.interest_free_period;
    } else {
        if (creditCard.statement_date < creditCard.payment_date) {
            if (currentDay > creditCard.statement_date) {
                if (currentMonth == 11) {
                    currentPaymentDate = new Date(currentYear + 1, 0, creditCard.payment_date);
                } else {
                    currentPaymentDate = new Date(currentYear, currentMonth + 1, creditCard.payment_date);
                };
            } else {
                currentPaymentDate = new Date(currentYear, currentMonth, creditCard.payment_date);
            };
        } else {
            if (currentDay > creditCard.statement_date) {
                if (currentMonth == 10) {
                    currentPaymentDate = new Date(currentYear + 1, 0, creditCard.payment_date);
                } else if (currentMonth == 11) {
                    currentPaymentDate = new Date(currentYear + 1, 1, creditCard.payment_date);
                } else {
                    currentPaymentDate = new Date(currentYear, currentMonth + 2, creditCard.payment_date);
                };
            } else {
                if (currentMonth == 11) {
                    currentPaymentDate = new Date(currentYear + 1, 0, creditCard.payment_date);
                } else {
                    currentPaymentDate = new Date(currentYear, currentMonth + 1, creditCard.payment_date);
                };
            };
        };
        maxInterestFreePeriod = Math.floor((currentPaymentDate - today) / 86400000);
    };
    $(`#${creditCard.id}-interest-free-period`).text(maxInterestFreePeriod);
    if (!creditCard.disabled && maxInterestFreePeriod > maxInterestFreePeriodCard.max_interest_free_period) {
        maxInterestFreePeriodCard.id = creditCard.id;
        maxInterestFreePeriodCard.max_interest_free_period = maxInterestFreePeriod;
    };
};
$(`#${maxInterestFreePeriodCard.id}-header`).append('<div class="ui yellow top right attached label"><i class="check icon"></i>最长免息期</div>');