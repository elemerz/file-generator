(function($) {
  var config;
  Number.random=function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  String.random=function(len){
    var a=[];
    for(var i=0; i < len;i++) a.push(String.fromCharCode(65+Number.random(0,25)));
    return a.join('');
  }
	var fileConfig = {};
  /**Generates a file with the Given Parameters*/
  function generateFile(){
    var $fileType= $("#fileType > option:selected"),
      fileExtension = $fileType.val();
      filePrefix= fileConfig.prefix,
      fileInfix=[],//dynamic part
      fileSuffix=fileConfig.suffix,
      allBytes=[],
      minSizeBytes = fileConfig.minSizeBytes,
      genLen = Math.max(minSizeBytes, Number(document.getElementById("fileSize").value) * Number($('[name="unit"]:checked').attr("multiplier"))) - minSizeBytes,
      urlCreator = window.URL || window.webkitURL,
      fileName="",
      blob=null,
      a = document.createElement('a');

    for(var i = 1; i <= genLen;i++){
      fileInfix[fileInfix.length] = Number.random(1,255);
    }
    allBytes=new Uint8Array(filePrefix.concat(fileInfix).concat(fileSuffix));
    fileName = prompt("Please enter File name", String.random(4) + "." + $fileType.val());
    blob = new Blob([allBytes], {type: "octet/stream"});
    a.href = urlCreator.createObjectURL(blob);
    a.download = fileName;
    a.click();
	}

  /**User Types in fileSize field*/
	function onFileSizeInput(e) {
	  var $fileSize = $(e.currentTarget),
      $selectedUnit = $('input[name="unit"]:checked'),
      v = Number($fileSize.val()),
      minsize = Number($selectedUnit.attr("minsize")),
      maxsize = Number($selectedUnit.attr("maxsize"));

	  //console.log("minBytes=", minbytes, ", maxBytes= ", maxbytes, ", v= ", v);
	  if(v < minsize){$fileSize.val(minsize);}
    if(v > maxsize){$fileSize.val(maxsize);}
  }

  /**User Selects from fileType field*/
  function onFileTypeChanged(e) {
    fileConfig = $(this).find("option:selected").data("config");
    $("#rdbB").attr("minsize", fileConfig.minSizeBytes).attr("maxsize", fileConfig.maxSizeBytes);
    $("#rdbK").attr("minsize", fileConfig.minSizeBytes/1024).attr("maxsize", fileConfig.maxSizeBytes/1024);
    $("#rdbM").attr("minsize", fileConfig.minSizeBytes/(1024*1024)).attr("maxsize", fileConfig.maxSizeBytes/(1024*1024));
    $('input[name="unit"]:checked').change();
  }

  /**User Changes fileSize Unit of measure (Byte/Kilobyte/MegaByte)*/
  function onUnitChanged(e) {
    $("#fileSize").attr("minbytes", $("#fileSize").val() * $(this).attr("")).trigger("input");
  }

  /**User selects Unit of measure by keyboard: SPACE OR ENTER = select*/
  function onUnitKeyPressed(e) {
    if(e.keyCode === 13 || e.keyCode === 32) {
	    $(e.currentTarget).prev("input").click();
    }
  }

	/* Attach page specific behavior on page load */
	$(function(){
	  $.getJSON("config.json",function(config){
	    config = config;
      for(var fileType in config) {
        $("#fileType").append($("<option/>",{"value":fileType, "text": fileType}).data("config", config[fileType]));
      }
      $("#fileType").on("change", onFileTypeChanged).change();
      $("#btnGenerate").on("click", generateFile);
      $("#fileSize").on("input", onFileSizeInput);
      $('input[name="unit"]').on("change", onUnitChanged).filter(":checked").change();
      $(".unit-container > label").on("keypress", onUnitKeyPressed);
    });
  });
}(jQuery));