document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reductionForm");
    const alertBox = document.getElementById("alertBox");
    const resetBtn = document.getElementById("resetBtn");

    // Map hari untuk preview
    const dayConfig = [
        { label: "Sunday",    amountId: "sunAmount", typeId: "sunType" },
        { label: "Monday",    amountId: "monAmount", typeId: "monType" },
        { label: "Tuesday",   amountId: "tueAmount", typeId: "tueType" },
        { label: "Wednesday", amountId: "wedAmount", typeId: "wedType" },
        { label: "Thursday",  amountId: "thuAmount", typeId: "thuType" },
        { label: "Friday",    amountId: "friAmount", typeId: "friType" },
        { label: "Saturday",  amountId: "satAmount", typeId: "satType" },
        { label: "Holiday",   amountId: "holAmount", typeId: "holType" }
    ];

    // Helper: hapus error state
    function clearValidation() {
        alertBox.classList.add("d-none");
        alertBox.innerHTML = "";

        const invalids = form.querySelectorAll(".is-invalid");
        invalids.forEach(el => el.classList.remove("is-invalid"));
    }

    // Helper: tampilkan error
    function showErrors(errors) {
        alertBox.classList.remove("d-none");
        alertBox.innerHTML = errors.join("<br>");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        clearValidation();

        // Ambil value wajib
        const requiredFields = [
            { id: "code",           label: "Code" },
            { id: "name",           label: "Name" },
            { id: "reductionType",  label: "Reduction Type" },
            { id: "wagonClass",     label: "Wagon Class" },
            { id: "tripFrom",       label: "Trip Date (From)" },
            { id: "tripTo",         label: "Trip Date (To)" },
            { id: "sellFrom",       label: "Sell Date (From)" },
            { id: "sellTo",         label: "Sell Date (To)" }
        ];

        const errors = [];

        requiredFields.forEach(f => {
            const el = document.getElementById(f.id);
            if (!el.value) {
                el.classList.add("is-invalid");
                errors.push(`${f.label} wajib diisi.`);
            }
        });

        // Validasi range sederhana Trip/Sell
        const tripFrom = document.getElementById("tripFrom");
        const tripTo   = document.getElementById("tripTo");
        const sellFrom = document.getElementById("sellFrom");
        const sellTo   = document.getElementById("sellTo");

        if (tripFrom.value && tripTo.value && tripFrom.value > tripTo.value) {
            errors.push("Trip Date (From) tidak boleh lebih besar dari Trip Date (To).");
            tripFrom.classList.add("is-invalid");
            tripTo.classList.add("is-invalid");
        }

        if (sellFrom.value && sellTo.value && sellFrom.value > sellTo.value) {
            errors.push("Sell Date (From) tidak boleh lebih besar dari Sell Date (To).");
            sellFrom.classList.add("is-invalid");
            sellTo.classList.add("is-invalid");
        }

        if (errors.length > 0) {
            showErrors(errors);
            return;
        }

        // Kalau lolos validasi => isi data preview
        document.getElementById("pvCode").textContent          = document.getElementById("code").value;
        document.getElementById("pvName").textContent          = document.getElementById("name").value;
        document.getElementById("pvNote").textContent          = document.getElementById("note").value || "-";
        document.getElementById("pvReductionType").textContent = document.getElementById("reductionType").value;
        document.getElementById("pvWagonClass").textContent    = document.getElementById("wagonClass").value;

        document.getElementById("pvTripDate").textContent =
            `${tripFrom.value} s.d ${tripTo.value}`;
        document.getElementById("pvSellDate").textContent =
            `${sellFrom.value} s.d ${sellTo.value}`;

        // Isi tabel per hari
        const tbody = document.getElementById("pvDaysBody");
        tbody.innerHTML = "";

        dayConfig.forEach(day => {
            const amountEl = document.getElementById(day.amountId);
            const typeEl   = document.getElementById(day.typeId);
            const amount   = amountEl.value || "0";
            const type     = typeEl.value;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${day.label}</td>
                <td class="text-end">${amount}</td>
                <td>${type}</td>
            `;
            tbody.appendChild(tr);
        });

        // Tampilkan modal Bootstrap
        const modalEl = document.getElementById("previewModal");
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    });

    // Tombol reset (Batal)
    resetBtn.addEventListener("click", function () {
        form.reset();
        clearValidation();
    });
});
