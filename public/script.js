const getAnimals = async () => {
    try {
        return (await fetch("/api/animal")).json();
    } catch (error) {
        console.log(error);
    }
};

const showAnimals = async () => {
    try {
        let animals = await getAnimals();
        let animalsDiv = document.getElementById("animal-list");
        animalsDiv.innerHTML = "";
        animals.forEach((animal) => {
            const section = document.createElement("section");
            section.classList.add("animal");
            animalsDiv.append(section);

            const a = document.createElement("a");
            a.href = "#";
            section.append(a);

            const h3 = document.createElement("h3");
            h3.innerHTML = animal.name;
            a.append(h3);

            const img = document.createElement("img");
            img.src = animal.img;
            section.append(img);

            a.onclick = (e) => {
                e.preventDefault();
                displayDetails(animal);
            };
        });
    } catch (error) {
        console.log(error);
    }
};

const displayDetails = (animal) => {
    const animalDetails = document.getElementById("animal-details");
    animalDetails.innerHTML = "";

    const dLink = document.createElement("a");
    dLink.innerHTML = "&#x2715;";
    animalDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    animalDetails.append(eLink);
    eLink.id = "edit-link";

    const h3 = document.createElement("h3");
    h3.innerHTML = `<strong>Animal Name: </strong> ${animal.name}`;
    animalDetails.append(h3);

    const color = document.createElement("p");
    color.innerHTML = `<strong>Color: </strong> ${animal.color}`;
    animalDetails.append(color);

    const size = document.createElement("p");
    size.innerHTML = `<strong>Size: </strong> ${animal.size}`;
    animalDetails.append(size);

    const located = document.createElement("p");
    located.innerHTML = `<strong>Located: </strong> ${animal.located}`;
    animalDetails.append(located);

    const diet = document.createElement("p");
    diet.innerHTML = `<strong>Diet: </strong> ${animal.diet}`;
    animalDetails.append(diet);

    const ul = document.createElement("ul");
    animalDetails.append(ul);
    console.log(animal.located);
    animal.located.forEach((located) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = located;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("title").innerHTML = "Edit Animals";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteAnimal(animal);
    };

    populateEditForm(animal);
};

const deleteAnimal = async (animal) => {
    try {
        let response = await fetch(`/api/animal${animal._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
        });

        if (response.status !== 200) {
            console.log("Error deleting");
            return;
        }

        showAnimals();
        document.getElementById("animal-details").innerHTML = "";
        resetForm();
    } catch (error) {
        console.log(error);
    }
};

const populateEditForm = (animal) => {
    const form = document.getElementById("add-edit-animal-form");
    form._id.value = animal._id;
    form.name.value = animal.name;
    form.color.value = animal.color;
    form.size.value = animal.size; // Fix: Corrected property name
    populateLocated(animal);
    form.diet.value = animal.diet; // Fix: Corrected property name
};

const populateLocated = (animal) => {
    const section = document.getElementById("description-boxes");
    animal.located.forEach((located) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = located;
        section.append(input);
    });
};

const addEditAnimal = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-animal-form");
    const formData = new FormData(form);

    let response;
    formData.append("descriptions", getDescriptions());
    if (form._id.value == -1) {
        formData.delete("_id");

        console.log(...formData);

        response = await fetch("/api/animals", {
            method: "POST",
            body: formData,
        });
    } else {
        console.log(...formData);

        response = await fetch(`/api/animals/${form._id.value}`, {
            method: "PUT",
            body: formData,
        });
    }

    if (response.status !== 200) {
        console.log("Error posting data");
    }

    let animal = await response.json();

    if (form._id.value != -1) {
        displayDetails(animal);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showAnimals();
};

const getDescriptions = () => {
    const inputs = document.querySelectorAll("#description-boxes input");
    let descriptions = [];

    inputs.forEach((input) => {
        descriptions.push(input.value);
    });

    return descriptions;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-animal-form");
    form.reset();
    form._id.value = "-1";
    document.getElementById("description-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add animal";
    resetForm();
};

const addDescription = (e) => {
    e.preventDefault();
    const section = document.getElementById("description-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

window.onload = () => {
    showAnimals();
    document.getElementById("add-edit-animal-form").onsubmit = addEditAnimal;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-description").onclick = addDescription;
};
