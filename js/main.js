window.onscroll = function (e) {
    let element = document.querySelector(".selection-box")
    // console.log(this.scrollY)
    if (this.scrollY >= 264) {
        element.classList.add("fixed");
    }
    else {
        element.classList.remove("fixed");
    }
}

//các thành phần nhỏ
class Component {
    title
    padding
    constructor(title) {
        this.title = title;
        this.data = ""
        this.padding = "%{}"
    }
    render() {
        let title = `<div class="row mb-3">
        <span class="content-label position-relative">
            ${this.title}
        </span>
        </div>`
        return ` <div class="component">${title + this.data}</div>`
    }
}

class SubComponent {

    render() {
        return (1)
    }
}
class Paragraph extends SubComponent {
    Para
    constructor(p) {
        super()
        this.Para = p
    }
    render() {
        return `<p>${this.Para}</p>`
    }
}
class Hobby extends SubComponent {
    name
    image
    content
    constructor(name, image, content) {
        super()
        this.name = name;
        this.image = image;
        this.content = content;
    }
    render() {
        return `<div class="row hobby">
        <img src="${this.image}" alt="" class="hobby-img">
        <div class="hobby-content">
            <div class="hobby-content-label">
                ${this.name}
            </div>
            <div class="hobby-content-description">
               ${this.content}
            </div>
        </div>
    </div>
    `
    }
}

class TimeLine extends SubComponent {
    name
    subname
    content
    constructor(name, subname, content) {
        super()
        this.name = name;
        this.subname = subname;
        this.content = content;
    }
    render() {
        return `<div class="timeline">
            <p class="timeline-title">${this.name}</p> 
            <p style="color: gray; font-size:1rem;margin-top:-8px   "> ${this.subname} </p>
            <p class="timeline-content"> ${this.content}  </p>
        </div >
    `
    }
}
class product extends SubComponent {
    nameProject
    image
    url
    constructor(nameProject, image, url) {
        super()
        this.nameProject = nameProject;
        this.image = image;
        this.url = url;
    }

    render() {
        return `

        <div class="col-6 product-item">
                <a href="${this.url}" class="product-item-img">
                            <img src="${this.image}" alt="">
                </a>
                <h3 class="product-item-title">${this.nameProject} </h3>
         </div>
        `
    }
}

class LIST extends Component {
    list //type SubComponent
    status
    constructor(title, list, status) {
        super(title)
        // this.title = title;
        this.status = status
        this.list = list;
        this.handleData()
    }
    handleData() {
        let data = ""
        for (let i = 0; i < this.list.length; i++) {
            let item = this.list[i];
            let l = null;
            if (this.status == "0") {
                l = new Paragraph(item)
            } else if (this.status == "1") {
                l = new TimeLine(item.name, item.subname, item.content);
            } else if (this.status == "2") {
                this.padding = `<div class="row product-box"> %{} </div>`
                l = new product(item.project, item.image, item.url)
            }
            else if (this.status == "3") {
                l = new Hobby(item.name, item.image, item.content)
            }
            //#EXTEND
            //  else if (this.status == "3") {
            //     l = new product(list.project, list.image, list.url)
            // }
            data += l.render()
        }
        this.data += this.padding.replace("%{}", data)
    }
}


class APP {
    selectData
    data_json
    constructor(data_name) {
        this.data_name = data_name
    }

    renderSelect() {
        let selectData = {};
        let data_json = this.data_json;
        for (var property in data_json) {
            let content = ""
            data_json[property].forEach((item, i) => {
                let component = new LIST(item.title, item.data, item.status);
                // }
                content += (component.render());
            })
            selectData[property] = content
        }
        this.selectData = selectData;
    }


    eventClickSection() {

        let selects = document.querySelectorAll(".selection-item")
        let contentSelect = document.querySelector("#selection-content")
        let curActive = selects[0]
        curActive.classList.add("active")
        let selectData = this.selectData
        contentSelect.innerHTML = selectData[curActive.id]
        for (let i = 0; i < selects.length; i++) {

            selects[i].onclick = function (e) {
                curActive.classList.remove("active")
                curActive = selects[i]
                curActive.classList.add("active")
                contentSelect.innerHTML = selectData[selects[i].id]
            }
        }
    }

    async runAPP() {
        this.data_json = await fetch(this.data_name)
            .then(response => response.text())
            .then(data => {

                return JSON.parse(data);
            });
        this.renderSelect();
        this.eventClickSection();

    }
}


app = new APP("./model/data.JSON");
app.runAPP()

