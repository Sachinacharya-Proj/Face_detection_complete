const chooseFile = document.querySelector('.span');
const originalChooseFile = document.querySelector('.choose');
const displayFiles = document.querySelector('.file_info');
let fileArray = [];

// Setting Click events
chooseFile.addEventListener('click', ()=>{
    originalChooseFile.click();
});

originalChooseFile.addEventListener('change', e => {
    const files = e.target.files;
    if (files.length > 2){
        alert('Note: Only 2 Images are Sufficient, so only first 2 images will be uploaded!');
    }
    for (let i = 0; i < files.length; i++){
        let file = files[i].name;
        let dataSource;
        if (i != files.length - 1){
            dataSource = `<p>${file}, </p>`;
        }else{
            dataSource = `<p>${file}</p>`;
        }
        displayFiles.innerHTML += dataSource;
    }
})
