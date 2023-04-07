const fileInput = document.getElementById('browse-file');
const dropFileZone = document.getElementById('drop-file-zone');

const fileStorage = [];

window.onload = () => {
    fileInput.onchange = UploadBrowseFile;
    dropFileZone.ondrop = UploadDropFile;
    dropFileZone.ondragover = PreventDefault;
};

function UploadBrowseFile(ev) {
    for (const file of ev.target.files) {
        if (file !== undefined) {
            fileStorage.push(file);
            CreateFileContainer(file);
        }
    }
}

function UploadDropFile(ev) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (IsUniqueFile(file)){
                fileStorage.push(file);
                CreateFileContainer(file);
            }
          }
        });
    }
    else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file) => {
            if (IsUniqueFile(file)) {
                fileStorage.push(file);
                CreateFileContainer(file);
            }
        });
      }
}

function IsUniqueFile(file) {
    let isUnique = true;

    fileStorage.forEach((value) => {
        if (file.name === value.name && file.size === value.size) {
            isUnique = false;
        }
    });

    return isUnique;
}

function CreateFileContainer(file) {
    const fileContainer = document.createElement('article');
    fileContainer.className = 'file-container';

    const imageFile = document.createElement('img');
    imageFile.className = 'image-file';
    fileContainer.appendChild(imageFile);

    if (file.type.includes('image')) {
        imageFile.src = URL.createObjectURL(file);
    }
    else if (file.type.includes('pdf')) {
        imageFile.src = '../Images/FileUploader-Icons/pdf-icon.svg';
    }
    else {
        imageFile.src = '../Images/FileUploader-Icons/archive-file-outline-icon.svg';
    }

    const fileInfo = document.createElement('p');
    fileInfo.className = 'file-container-name';
    fileInfo.innerHTML = `${file.name} <br> Size: ${returnFileSize(file.size)}`;
    fileContainer.appendChild(fileInfo);

    const fileOptions = document.createElement('div');
    fileOptions.className = 'file-container-options';
    fileContainer.appendChild(fileOptions);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'options-button'
    deleteButton.onclick = () => {
        DeleteFile(file.name);
    }
    fileOptions.appendChild(deleteButton);

    const deleteIcon = document.createElement('img');
    deleteIcon.className = 'options-button-icons';
    deleteIcon.src = '../Images/FileUploader-Icons/trash-bin-icon.svg';
    deleteButton.appendChild(deleteIcon);

    const viewButton = document.createElement('button');
    viewButton.className = 'options-button'
    fileOptions.appendChild(viewButton);

    const ViewIcon = document.createElement('img');
    ViewIcon.className = 'options-button-icons';
    ViewIcon.src = '../Images/FileUploader-Icons/magnifier-glass-icon.svg';
    viewButton.appendChild(ViewIcon);

    fileContainer.file = file;
    AddFileContainerToPreview(fileContainer)
}

function AddFileContainerToPreview(fileContainer) {
    if (fileContainer === undefined) {
        return;
    }

    dropFileZone.appendChild(fileContainer);
}

function DeleteFile(fileName) {
    //Remove the file from fileStorage.
    for (let i = 0; i < fileStorage.length; i++) {
        if (fileStorage[i].name === fileName) {
            fileStorage.splice(i, 1)
        }
    }

    //Mark the file-container as "to remove".
    //This is done so the length does not change as it loops.
    for (let i = 0; i < dropFileZone.children.length; i++) {
        const fileContainer = dropFileZone.children[i];
        
        if (fileContainer.file === undefined){
            continue;
        }

        if (fileContainer.file.name === fileName){
            fileContainer.toRemove = true;
        }
    }

    //Remove the file-container from dropFileZone.
    for (let i = 0; i < dropFileZone.children.length; i++) {
        if (dropFileZone.children[i].toRemove){
            dropFileZone.children[i].remove();
        }
    }
}

function UploadFiles() {
    
}

function returnFileSize(number) {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      return `${(number / 1048576).toFixed(1)} MB`;
    }
}

  function PreventDefault(ev) {
    ev.preventDefault();
  }