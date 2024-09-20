let slideout;
window.Shared = {
    GetScreenWidth: (id) => {
        let o = document.getElementById(id);
        if (o != null) { return o.clientWidth; }
        return 0;
    },

    SaveAsFile: (bytesBase64) => {
        fetch(`data:application/json;base64,${bytesBase64}`)
            .then(response => response.blob())
            .then(blob => {
                let link = window.document.createElement("a");
                link.href = window.URL.createObjectURL(blob, { type: "application/json" });
                link.download = "TodoExport.json";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }
}