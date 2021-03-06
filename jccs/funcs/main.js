function main() {

	/*-------------MAIN VARIABLES ---------------*/	
	//Saved or not saved icons
	var storeIcon = "&#10022;";
	var saveIcon = "&#10039;";
	var exportIcon = "&#10047;";
	
	// Event variables
    var groundPoint;
	var currentMeshes={};
	var currentParents={};
    //var currentMesh = null;
    
    var newModel=true;
	//var currentMaterial;
	//var currentMaterials={};
	var detached = false;
	var shiftDown=false;
	var moveRight = new BABYLON.Vector3(60, 0, 0);  // +ve x axis direction
	var moveLeft = new BABYLON.Vector3(-60, 0, 0); // -ve x axis direction
	var moveUp = new BABYLON.Vector3(0, 60, 0); // +ve y axis direction
	var moveDown = new BABYLON.Vector3(0, -60, 0); // -ve y axis direction
	var moveForward = new BABYLON.Vector3(0, 0, 60); // +ve z axis direction
	var moveBackward = new BABYLON.Vector3(0, 0, -60); // -ve z axis direction
	
	var confirmName;
	var confirmFunc;
	
	var cursorPos;
	var downMouse = false;
	var dlgbox;
		
	var num_of_boxes = 0;
	var num_of_models = 0;
	var num_in_scene = 0;
	var jcCanvas;
	var jcEngine;
	var JCubees = {};
	var jccsStudio, jcssStudio;
	var jcModels={};
	var sceneParents={}, sceneModels={}, modelChildren={};
	var doAddToScene = false;
	var inScene=false;
	
	var frontOfLeftFace={};
	var frontOfRightFace={};
	var frontOfUpFace={};
	var frontOfDownFace={};
	var frontOfFrontFace={};
	var frontOfBackFace={};
	var bounds={};
	
	
		
	
	/***********************************CONSTRUCTION DIALOGUE CODES***********************************/
	
	/*-------------CONSTRUCTION MENU ELEMENTS---------------	*/
	//Get Menu Elements 
	var Header = document.getElementById("Header");
	var menu = document.getElementById("menu");
	var menulist = document.getElementById("menulist");
	
	var switch_to_scene = document.getElementById("switchToScene");
	var add_to_scene = document.getElementById("addToScene");
	var model = document.getElementById("model");
	
	var leftarrow = document.getElementById("leftarrow");
	var rightarrow = document.getElementById("rightarrow");
	var uparrow = document.getElementById("uparrow");
	var downarrow = document.getElementById("downarrow");
	var forwardarrow = document.getElementById("forwardarrow");
	var backarrow = document.getElementById("backarrow");
	
	// File Menu and Sub-Menus
	var file_ = document.getElementById("file");
	var newmodel = document.getElementById("newmodel");
	var subfilemenu = document.getElementById("subfilemenu");
	var store = document.getElementById("store");
	var store_as = document.getElementById("store_as");
	var fetch = document.getElementById("fetch");
	var save = document.getElementById("save");
	var save_as = document.getElementById("save_as");
	var openFile  = document.getElementById("open"); 
	
	// Cubee Menu and Sub-Menus
	var cubee = document.getElementById("cubee");
	var subcubeemenu = document.getElementById("subcubeemenu");
	
	var box = document.getElementById("box");
	var cyl = document.getElementById("cyl");
	var sph = document.getElementById("sph");
	var rof = document.getElementById("rof");
	
	// Selection Menu and Sub-Menus
	var selection = document.getElementById("selection");
	var subselectionmenu = document.getElementById("subselectionmenu");
	var clear = document.getElementById("clear");
	var all = document.getElementById("all");
	var colour = document.getElementById("colour");
	colour.colarray=[0,0,255];
	
	var colours = document.getElementById("colours");
	setColours(colours);
	
	var texturepics = document.getElementById("texturepics");
	setTextures();
	
	var rotateX = document.getElementById("rotateX");
	var rotateY = document.getElementById("rotateY");
	var rotateZ = document.getElementById("rotateZ");
	
	//*******sub menu list ************
	var subMenuList = [subfilemenu, subcubeemenu, subselectionmenu];
	
	/*--------CONSTRUCTION DIALOGUE BOX ELEMENTS------------------*/
	
	var ddb = document.getElementsByClassName("dragDialogueBox");
	var closediv = document.getElementsByClassName("closediv");
	var headerDiv = document.getElementsByClassName("heading");
	var cancelDiv = document.getElementsByClassName("DBCancel"); 
	var inpt = document.getElementsByClassName("inpt");
	
	var storeDB = document.getElementById("storeDB"); 
	var storeIn = document.getElementById("storeIn");
	var storeBut = document.getElementById("storeBut");
	
	var fetchDB = document.getElementById("fetchDB"); 
	var fetchList = document.getElementById("fetchList");
	var fetchBut = document.getElementById("fetchBut");
	
	var confirmDB = document.getElementById("confirmDB"); 
	var confirmBut = document.getElementById("confirmBut");	
	
	/*----------CONSTRUCTION MENU EVENTS--------------------------------*/

	//move events
	leftarrow.addEventListener("mousedown", leftMove, false);
	rightarrow.addEventListener("mousedown", rightMove, false);
	uparrow.addEventListener("mousedown", upMove, false);
	downarrow.addEventListener("mousedown", downMove, false);
	forwardarrow.addEventListener("mousedown", forwardMove, false);
	backarrow.addEventListener("mousedown", backMove, false);
	
	//file events
	file_.addEventListener('click', showFileMenu, false);
	newmodel.addEventListener('click', doNew, false);
	store.addEventListener('click', doStore, false);
	store_as.addEventListener('click', openStoreAs, false);
	fetch.addEventListener('click', openFetch, false);
	
	if(typeof(Storage) !== "undefined") {
		save.addEventListener('click', doSave, false);
		//save_as.addEventListener('click', doSaveAs, false);
		//openFile.addEventListener('click', doOpen, false);
	}
	
	//cubee events
	cubee.addEventListener("click", showCubeeMenu, false);
	box.addEventListener("click", makeBox, false);
	cyl.addEventListener("click", makeCylinder, false);
	sph.addEventListener("click", makeSphere, false);
	rof.addEventListener("click", makeRoof, false);
	
	//Selection events
	selection.addEventListener("click", showSelectionMenu, false);
	clear.addEventListener("click", clearSelection, false);
	all.addEventListener("click", selectAll, false);
	colour.addEventListener("click", function() {setMeshColour(this)}, false );
	
	rotateX.addEventListener("click", Xrotate, false);
	rotateY.addEventListener("click", Yrotate, false);
	rotateZ.addEventListener("click", Zrotate, false);
	
	//Set readable styles for Selection
	selection.style.color="#888888";
	
	//To scene event
	switch_to_scene.addEventListener("click", construct_to_scene, false);
	add_to_scene.addEventListener("click", addtoscene, false);
	
	
	
	/*-----------CONSTRUCTION DIALOGUE BOX EVENTS--------------------*/
	
	//Drag events
	window.addEventListener('mousemove', function(e) {doDrag(e)}, false);
	
	for(var i=0;i<ddb.length;i++){
        ddb[i].style.top = "150px";
        ddb[i].style.left = "500px";
   };
	
	for(var i=0;i<headerDiv.length;i++){
        headerDiv[i].addEventListener('mousedown', function(e) {startdbDrag(e, this)}, false);
        headerDiv[i].addEventListener('mouseup', function(e) {enddbDrag(e)}, false);
    }
	;
	//Close dialogue box
	for(var i=0;i<closediv.length;i++){
        closediv[i].addEventListener('click', function() {doClose(this)}, false);
   };
    
    //Cancel dialogue box
    for(var i=0;i<cancelDiv.length;i++){
        cancelDiv[i].addEventListener('click', function() {doClose(this)}, false);
    };
    
    //input dialogue box
    for(var i=0;i<inpt.length;i++){   	
        inpt[i].addEventListener('keydown', function(evt) {inpKeyDown(evt)}, false);
    };    
    
    //Confirm Dialogue Box
    confirmBut.addEventListener('click', doConfirm, false);
    
    //Store As in App
    storeBut.addEventListener('click', doStoreAs, false);

	//Fetch fromApp
	fetchBut.addEventListener('click', doFetch, false);
		
	/*-------------CONSTRUCTION MENU FUNCTIONS ---------------*/
	//set colours in selection menu
	function setColours(colours) {
		var colarray = [ 
						[[255,0,0],[255,192,0],[255,255,0]],
						[[192,255,0],[0,255,0],[0,255,192]],
						[[0,0,255],[255,0,255],[192,0,255]],
						[[255,255,255],[127,127,127],[0,0,0]]
		];
		
		for(row=0;row<4;row++) {
			for(clmn=0;clmn<3;clmn++) {
				col = document.createElement('div');
				col.colarray = colarray[row][clmn];
				col.style.backgroundColor = "rgb("+colarray[row][clmn][0] +","+colarray[row][clmn][1]+","+colarray[row][clmn][2]+")";
				col.style.opacity = 0.5;
				col.className="chart";
				col.addEventListener("mouseover", function() {this.style.opacity = 1}, false );
				col.addEventListener("mouseout", function() {this.style.opacity = 0.5}, false );
				col.addEventListener("click", function() {setMeshColour(this)}, false );
				colours.appendChild(col);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//set textures in selection menu
	function setTextures() {
		var textures = [
				"Metal",
				"Wood",
				"Rust",
				"Wheel"
		]
		for(var t=0;t<textures.length;t++) {
			var txtr = document.createElement('div');
			txtr.imgName = "images/xt"+textures[t]+".png";
			txtr.style.backgroundImage ="url('"+txtr.imgName+"')";
			txtr.alt = textures[t];
			txtr.title = textures[t];
			txtr.className = "textureimage";
			txtr.addEventListener("click", function() {setMeshTexture(this)}, false );
			texturepics.appendChild(txtr);
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//menu choices actions

	//File functions
	function showFileMenu() {
		hideSubMenus();
		subfilemenu.style.visibility="visible";
		file_.style.borderBottom = "none";
	}
	
	function doNew() {
		if(!JCisStored) 
		{
			confirmName = name;
			confirmFunc = newJCubees;
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and delete the current model?'
			openConfirmDBox();
		}
		else {
			newJCubees();
		}
	}
	
	function newJCubees() {
		hideSubMenus();
		currentModelName = 'model'+(num_of_models++);
		JCisStored = false;
		for(var mesh in JCubees) {
			JCubees[mesh].destroy();
			delete JCubees[mesh];
		}
		JCubees = {};
		currentMeshes = {};
	
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;
		storeIn.value = currentModelName;
		
		selection.innerHTML="Selection";
		selection.style.color=="rgb(136, 136, 136)"
	}
	
	function doStore() {	
		if(newModel) {
			newModel = false;
			openStoreAs();
		}
		else {
			model.innerHTML = "Model -- "+currentModelName;
			JCisStored = true;
			doStoreModel(currentModelName);
		}
	}
	
	function openStoreAs() {		
		storeDB.style.visibility = 'visible';
	}
	
	function openFetch() {
		if(!JCisStored) 
		{
			confirmName = name;
			confirmFunc = fillFetch;
			confirmDesc.innerHTML = 'The current model <span style="font-style:italic"> '+confirmName+'</span> has not been stored.<BR>Do you want to continue and overwrite the current model?'
			openConfirmDBox();
		}
		else {
			fillFetch();
		}
	}
	
	function fillFetch() {
		var fetch_array =[];
		for(var name in jcModels) {
			fetch_array.push(name);
		}		
		fetch_array.sort();
		var flen=fetch_array.length;
		var cols = Math.ceil(flen/10);
		var rows = 10;
		var len;
		var fetch_row, fetch_col;
		var i=0;
		for(var c=0; c<cols; c++){
			fetch_col = document.createElement("div");
			fetch_col.style.left=c*100+"px";
			fetchList.appendChild(fetch_col);
			fetch_ul = document.createElement("ul");
			fetch_col.appendChild(fetch_ul);
			len = flen - c*10;
			if(len<10) {
				rows=len;
			}
			for(var r=0; r<rows; r++) {
				fetch_li = document.createElement("li");
				fetch_li.innerHTML=fetch_array[i++];
				fetch_li.addEventListener('click', function() {fetchname.innerHTML = this.innerHTML}, false);
				fetch_ul.appendChild(fetch_li);
			}
		}
		fetchDB.style.visibility = 'visible';
	}
	
	function doSave() {
		//var serializedMeshes=[];
		for(var ref in JCubees) {
			//serializedMeshes.push(JCubees[ref].Jcubee.name);
console.log(JCubees[ref].Jcubee.name);					
		
		
			var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(JCubees[ref].Jcubee);
			console.log("mesh",serializedMesh);
			var strMesh = JSON.stringify(serializedMesh);
			console.log("string",strMesh);
		}
	}
	
	//Cubee functions
	function showCubeeMenu() {
		hideSubMenus();
		subcubeemenu.style.visibility="visible";
		cubee.style.borderBottom = "none";
	}
	
	//Selection functions
	function showSelectionMenu() {
		if(selection.style.color=="rgb(136, 136, 136)") {
			return
		}
		if(selection.innerHTML == "Selection") {
			hideSubMenus();
			subselectionmenu.style.visibility="visible";
			selection.style.borderBottom = "none";
		}
		else {			
			selectAll();
			selection.innerHTML="Selection";
		}
	}
	
	function clearSelection() {
		for(var mesh in JCubees) {						
			JCubees[mesh].Jcubee.material.alpha = 1;
			JCubees[mesh].hideMarkers();
		}			
		currentMeshes = {};
		//currentMaterials = {};
		hideSubMenus();
		//selection.style.color="rgb(136, 136, 136)"
		selection.innerHTML = "Select All";
	}
	
	function selectAll() {
		for(var mesh in JCubees) {						
			if(!(mesh in currentMeshes)) {						
				JCubees[mesh].Jcubee.material.alpha = 1;
				JCubees[mesh].showMarkers();
				currentMeshes[mesh] = JCubees[mesh].Jcubee;
			}
		}
		selection.innerHTML = "Selection";
		selection.style.color="#000000";
	}
	
	function Xrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.WORLD);		
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}

	function Yrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Y, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function Zrotate() {
		for(var mesh in currentMeshes) {
			currentMeshes[mesh].rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.WORLD);						
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//Add to Scene functions	
	function addtoscene() {
		 sceneSwitch(currentModelName);
		 hideSubMenus();
		 menu.style.visibility = 'hidden';
		 scene_menu.style.visibility = 'visible';
		 Header.innerHTML ='Scene';
	}
	
	function sceneSwitch(name) {
		for(var model in sceneParents) {
			sceneParents[model].setEnabled(true);
			for(var i=0; i<modelChildren[model].length;i++) {
				modelChildren[model][i].enable();
			}
		}
		
		var modelParent = "Iparent"+name+num_in_scene;
		var modelName = "I"+name+num_in_scene;
		sceneParents[modelParent] = BABYLON.Mesh.CreateBox(modelParent, 60.0, jccsStudio.scene);
		sceneParents[modelParent].visibility = 0;
		selectNewModel(sceneParents[modelParent]);
		modelChildren[modelParent] = [];	
	
		for(var ref in JCubees) {			
			sceneModels[modelName+ref] = new JcubeeBlank(modelName+ref);
			sceneModels[modelName+ref].Jcubee = JCubees[ref].Jcubee.clone(modelName+ref);
			sceneModels[modelName+ref].Jcubee.material = JCubees[ref].Jcubee.material.clone();
			sceneModels[modelName+ref].Jcubee.material.alpha = 1;			
			sceneModels[modelName+ref].Jcubee.parent = sceneParents[modelParent];
			sceneModels[modelName+ref].addMarkers(jccsStudio.scene,0.5);
			modelChildren[modelParent].push(sceneModels[modelName+ref]);				
			JCubees[ref].disable();
		}
		
		sceneParents[modelParent].scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);		
		
		num_in_scene++;			
			
		inScene=true;
	}
	
	//General Menu functions
	function resetBorders() {		
		var elm=menulist.firstChild;		
		elm=findNextDIV(elm);
		while (elm) {			
			elm.style.borderBottom ="1px solid black";
			elm=findNextDIV(elm);
		}
	}
	
	function hideSubMenus() {
		for(var i=0; i<subMenuList.length;i++) {
			subMenuList[i].style.visibility="hidden";
		}		
		resetBorders();
	}
	
	function findNextDIV(elm) {
	do {
		elm = elm.nextSibling;
	} while (elm && elm.nodeName !="DIV");
	return elm;
	}

	function setMeshColour(elm) {
		var elmMat = new BABYLON.StandardMaterial("elmMat", jccsStudio.scene);
		elmMat.emissiveColor = new BABYLON.Color3(elm.colarray[0]/255,elm.colarray[1]/255,elm.colarray[2]/255);
		for(var mesh in currentMeshes) {						
			currentMeshes[mesh].material = elmMat;
		}
		colour.colarray=elm.colarray;
		colour.style.backgroundColor="rgb("+elm.colarray[0] +","+elm.colarray[1]+","+elm.colarray[2]+")";
	}
	
	function setMeshTexture(elm) {
		var elmTxtrMat = new BABYLON.StandardMaterial("elmTxtrMat", jccsStudio.scene);
		elmTxtrMat.emissiveTexture = new BABYLON.Texture(elm.imgName, jccsStudio.scene);
		for(var mesh in currentMeshes) {						
			currentMeshes[mesh].material = elmTxtrMat;
		}
	}
	
	//Return to scene
	function construct_to_scene() {
		for(var model in sceneParents) {
			sceneParents[model].setEnabled(true);
			for(var child in modelChildren[model]) {
				modelChildren[model][child].enable();
			}
		}
		for(var ref in JCubees) {
			JCubees[ref].disable()
		}
		hideSubMenus();
		menu.style.visibility = 'hidden';
		scene_menu.style.visibility = 'visible';
		Header.innerHTML = 'scene';
		inScene = true;
	}
	
	
	/*-------------CONSTRUCTION DIALOGUE BOX FUNCTIONS--------*/

	function doClose(box) {
		box.parentNode.parentNode.parentNode.style.visibility = 'hidden';
	}
	
	//Drag Dialogues
	function startdbDrag(e, box) {
		cursorPos = getPosition(e);
		downMouse = true;
		dlgbox = box.parentNode.parentNode;				
	}
	
	function doDrag(e, box) {
		if(!downMouse) {return};

		var cursorNow = getPosition(e);	
		var dx = cursorNow.x - cursorPos.x;
		var dy = cursorNow.y - cursorPos.y;
		cursorPos = cursorNow;
		dlgbox.style.top = (parseInt(dlgbox.style.top) + dy)+"px";
		dlgbox.style.left = (parseInt(dlgbox.style.left) + dx)+"px";
	};
	
	function enddbDrag(e) {
		downMouse = false;				
	};
	
	function inpKeyDown(evt) {		
		evt.stopPropagation();
	};
	
	//Confirm actions
	function openConfirmDBox(name) {
		confirmDB.style.visibility = 'visible';
	}
	
	function doConfirm() {
		confirmDB.style.visibility = 'hidden';
		confirmFunc(confirmName);
	}
	
	
	//Store in app
	function doStoreAs() {
		var name = storeIn.value;	
		if(name in jcModels && !newModel) {
			confirmName = name;
			confirmFunc = doStoreModel;
			confirmDesc.innerHTML = 'The model <span style="font-style:italic"> '+confirmName+'</span> already exists.<BR>Do you want to continue to and overwrite the existing model?';
			openConfirmDBox();
		}
		else {
			doStoreModel(name);
		}
	}
	
	function doStoreModel(name) {
		var newRef;				
		storeDB.style.visibility = 'hidden';
		if(name in jcModels) {
			for(var ref in jcModels[name]) {
				delete jcModels[name][ref];
			}
		}
		jcModels[name] = {};
		for (var ref in JCubees) {			
			newRef = "S"+getModelRef(ref)+"¬"+getNameRef(ref);
			jcModels[name][newRef] = new JcubeeBlank(newRef);
			jcModels[name][newRef].Jcubee = JCubees[ref].Jcubee.clone(newRef);
			jcModels[name][newRef].addMarkers(jccsStudio.scene);		
			jcModels[name][newRef].disable();
		}

		
		currentModelName = name;
		model.innerHTML = "Model -- "+currentModelName+"&nbsp;&nbsp"+saveIcon+exportIcon;
		
		storeIn.value = currentModelName;
		JCisStored = true;		
	}
	
	function doFetch() {
		if(inScene) {
			doFetchToScene();
		}
		else {
			doFetchToConstruct()
		}
	}
	
	function doFetchToConstruct() {
		var name = fetchname.innerHTML;
		for( var ref in JCubees) {
			if(ref in currentMeshes) {
				delete currentMeshes[ref];
			}
			JCubees[ref].disable();
			delete JCubees[ref].Jcubee;
			delete JCubees[ref];
		}
		JCubees ={};
		currentMeshes ={};
		for (var ref in jcModels[name]) {
			newRef = "L"+getModelRef(ref)+"¬"+getNameRef(ref);		
			JCubees[newRef] = new JcubeeBlank(newRef);		
			JCubees[newRef].Jcubee = jcModels[name][ref].Jcubee.clone(newRef);
			JCubees[newRef].addMarkers(jccsStudio.scene);
			JCubees[newRef].enable();
		}
		
		selectAll();
		
		currentModelName = name;
		model.innerHTML = "Model -- "+currentModelName;
		JCisStored = true;
		fetchDB.style.visibility = 'hidden';
	}
	
		function doFetchToScene() {
		var name = fetchname.innerHTML;
		for(var model in sceneParents) {
			sceneParents[model].setEnabled(true);
			for(var i=0; i<modelChildren[model].length;i++) {
				modelChildren[model][i].enable();
			}
		}
		
		var modelParent = "Iparent"+name+num_in_scene;
		var modelName = "I"+name+num_in_scene;
		sceneParents[modelParent] = BABYLON.Mesh.CreateBox(modelParent, 60.0, jccsStudio.scene);
		sceneParents[modelParent].visibility = 0;
		selectNewModel(sceneParents[modelParent]);
		modelChildren[modelParent] = [];	
	
		for(var ref in jcModels[name]) {			
			sceneModels[modelName+ref] = new JcubeeBlank(modelName+ref);
			sceneModels[modelName+ref].Jcubee = jcModels[name][ref].Jcubee.clone(modelName+ref);
			sceneModels[modelName+ref].Jcubee.material = jcModels[name][ref].Jcubee.material.clone();
			sceneModels[modelName+ref].Jcubee.material.alpha = 1;			
			sceneModels[modelName+ref].Jcubee.parent = sceneParents[modelParent];
			sceneModels[modelName+ref].addMarkers(jccsStudio.scene,0.5);
			modelChildren[modelParent].push(sceneModels[modelName+ref]);				
		}
		
		sceneParents[modelParent].scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);		
		
		num_in_scene++;	
		fetchDB.style.visibility = 'hidden';
	}
	
	/*********************************************SCENE DIALOGUE CODE****************************************/
	
	/*-------------SCENE MENU ELEMENTS---------------	*/
	//Get Menu Elements 
	var scene_menu = document.getElementById("scene_menu");
	scene_menu.style.visibility = 'hidden';
	var scene_menulist = document.getElementById("scene_menulist");
	
	var scene_constructSite = document.getElementById("scene_constructSite");
	var scene_scene = document.getElementById("scene_scene");
	
	var scene_leftarrow = document.getElementById("scene_leftarrow");
	var scene_rightarrow = document.getElementById("scene_rightarrow");
	var scene_uparrow = document.getElementById("scene_uparrow");
	var scene_downarrow = document.getElementById("scene_downarrow");
	var scene_forwardarrow = document.getElementById("scene_forwardarrow");
	var scene_backarrow = document.getElementById("scene_backarrow");
	
	// File Menu and Sub-Menus
	var scene_file_ = document.getElementById("scene_file");
	var scene_subfilemenu = document.getElementById("scene_subfilemenu");
	var scene_fetch = document.getElementById("scene_fetch");
	var scene_save = document.getElementById("scene_save");
	var scene_save_as = document.getElementById("scene_save_as");
	var scene_openFile = document.getElementById("scene_open");
	
		// Selection Menu and Sub-Menus
	var scene_selection = document.getElementById("scene_selection");
	var scene_subselectionmenu = document.getElementById("scene_subselectionmenu");
	var scene_clear = document.getElementById("scene_clear");
	var scene_all = document.getElementById("scene_all");

	var scene_rotateX = document.getElementById("scene_rotateX");
	var scene_rotateY = document.getElementById("scene_rotateY");
	var scene_rotateZ = document.getElementById("scene_rotateZ");
	
	//*******sub menu list ************
	var scene_subMenuList = [scene_subfilemenu, scene_subselectionmenu];
	
		/*  -------LOCAL STORAGE CHECK----------------*/
	if(typeof(Storage) === "undefined") {
		save.parentNode.removeChild(save);
		save_as.parentNode.removeChild(save_as);
		openFile.parentNode.removeChild(openFile);
		scene_save.parentNode.removeChild(scene_save);
		scene_save_as.parentNode.removeChild(scene_save_as);
		scene_openFile.parentNode.removeChild(scene_openFile);
	}
	
	/*----------SCENE MENU EVENTS--------------------------------*/

	//move events
	scene_leftarrow.addEventListener("mousedown", leftModelMove, false);
	scene_rightarrow.addEventListener("mousedown", rightModelMove, false);
	scene_uparrow.addEventListener("mousedown", upModelMove, false);
	scene_downarrow.addEventListener("mousedown", downModelMove, false);
	scene_forwardarrow.addEventListener("mousedown", forwardModelMove, false);
	scene_backarrow.addEventListener("mousedown", backModelMove, false);
	
	//file events
	scene_file_.addEventListener('click', scene_showFileMenu, false);
	scene_fetch.addEventListener('click', fillFetch, false);
	//to do scene_save.addEventListener('click', scene_doSave, false);
	//to do scene_save_as.addEventListener('click', scene_openSaveAs, false);
	
	//return to construction site event
	scene_constructSite.addEventListener('click', scene_to_construct, false);
	
	//Selection events
	scene_selection.addEventListener("click", scene_showSelectionMenu, false);
	scene_clear.addEventListener("click", scene_clearSelection, false);
	scene_all.addEventListener("click", scene_selectAll, false);
	
	scene_rotateX.addEventListener("click", scene_Xrotate, false);
	scene_rotateY.addEventListener("click", scene_Yrotate, false);
	scene_rotateZ.addEventListener("click", scene_Zrotate, false); 
	
	/*-------------SCENE MENU FUNCTIONS ---------------*/
	
	//File functions
	function scene_showFileMenu() {
		scene_hideSubMenus();
		scene_subfilemenu.style.visibility="visible";
		scene_file_.style.borderBottom = "none";
	}
	
	//Selection functions
	function scene_showSelectionMenu() {
		if(scene_selection.style.color=="rgb(136, 136, 136)") {
			return
		}
		if(scene_selection.innerHTML == "Selection") {
			scene_hideSubMenus();
			scene_subselectionmenu.style.visibility="visible";
			scene_selection.style.borderBottom = "none";
		}
		else {			
			scene_selectAll();
			scene_selection.innerHTML="Selection";
		}
	}
	
	function scene_clearSelection() {
		for(var model in sceneParents) {						
			for(var i=0; i<modelChildren[model].length;i++) {
				modelChildren[model][i].Jcubee.material.alpha = 1;
				modelChildren[model][i].hideMarkers();
			}
		}			
		currentParents = {};
		scene_hideSubMenus();
		scene_selection.innerHTML = "Select All";
	}
	
	function scene_selectAll() {
		for(var model in sceneParents) {						
			if(!(model in currentParents)) {
				for(var i=0; i<modelChildren[model].length;i++) {
					modelChildren[model][i].Jcubee.material.alpha = 1;
					modelChildren[model][i].showMarkers();
				}						
				currentParents[model] = sceneParents[model];
			}
		}
	}
	
	//rotation functions
	function scene_Xrotate() {
		for(var model in currentParents) {
			currentParents[model].rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.WORLD);	
			for(var i=0; i<modelChildren[model].length;i++) {
				modelChildren[model][i].moveT(modelChildren[model][i].Jcubee.getAbsolutePosition());
			}			
		}
	}
	
	function scene_Yrotate() {
		for(var model in currentParents) {
			currentParents[model].rotate(BABYLON.Axis.Y, -Math.PI/2, BABYLON.Space.WORLD);
			for(var i=0; i<modelChildren[model].length;i++) {
				modelChildren[model][i].moveT(modelChildren[model][i].Jcubee.getAbsolutePosition());
			}		
		}
	}
	
	function scene_Zrotate() {
		for(var model in currentParents) {
			currentParents[model].rotate(BABYLON.Axis.Z, -Math.PI/2, BABYLON.Space.WORLD);
			for(var i=0; i<modelChildren[model].length;i++) {
				modelChildren[model][i].moveT(modelChildren[model][i].Jcubee.getAbsolutePosition());
			}		
		}
	}
	
	//Return to construction site
	function scene_to_construct() {
		for(var model in sceneParents) {
			sceneParents[model].setEnabled(false);
			for(var child in modelChildren[model]) {
				modelChildren[model][child].disable();
			}
		}
		for(var ref in JCubees) {
			JCubees[ref].enable()
		}
		scene_hideSubMenus();
		menu.style.visibility = 'visible';
		scene_menu.style.visibility = 'hidden';
		Header.innerHTML = 'Construction Site';
		inScene = false;
	}
	
	//General Menu functions
	function scene_resetBorders() {		
		var elm=scene_menulist.firstChild;		
		elm=findNextDIV(elm);
		while (elm) {			
			elm.style.borderBottom ="1px solid black";
			elm=findNextDIV(elm);
		}
	}
	
	function scene_hideSubMenus() {
		for(var i=0; i<scene_subMenuList.length;i++) {
			scene_subMenuList[i].style.visibility="hidden";
		}		
		scene_resetBorders();
	}
	
	
	/***********************************************MODEL CODES************************************/
	
	/*-------------START LIST OF MODELS---------------*/
	var currentModelName = 'model'+(num_of_models++);
	var JCisStored = false;
	JCubees = {};
	
	model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;
	storeIn.value = currentModelName;
	
	
	/*-------------CONSTRUCTION STUDIO ---------------*/	
	// Set the construction studio
	jcCanvas = document.getElementById("jcCanvas");

	jcEngine = new BABYLON.Engine(jcCanvas, true);

	jccsStudio = new Studio(jcEngine);
	
	jccsStudio.scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
	
	jccsStudio.camera = new BABYLON.ArcRotateCamera("Camera", 0, 50, 300, new BABYLON.Vector3(0, 300, 0), jccsStudio.scene);
	jccsStudio.camera.setPosition(new BABYLON.Vector3(0, 200, -1400));	
	jccsStudio.camera.lowerBetaLimit = 0.1;
	jccsStudio.camera.upperBetaLimit = (Math.PI / 2) * 0.9;
	jccsStudio.camera.attachControl(jcCanvas, true);
	
	//jccsStudio.scene.activeCameras.push(jccsStudio.camera);
	
	jccsStudio.frontLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, 2000), jccsStudio.scene);
	jccsStudio.backLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(3000, -6000, 2000), jccsStudio.scene);
	jccsStudio.bottomLight = new BABYLON.PointLight("omni", new BABYLON.Vector3(-3000, 6000, -2000), jccsStudio.scene);
	jccsStudio.frontLight.intensity = 0.2;
	jccsStudio.backLight.intensity = 0.2;
	jccsStudio.bottomLight.intensity = 0.2;
	
	//Materials
	var greenGridMat = new BABYLON.StandardMaterial("greenGrid", jccsStudio.scene);
	greenGridMat.emissiveColor = new BABYLON.Color3(0,1,0);
	
	var whiteGridMat = new BABYLON.StandardMaterial("whiteGrid", jccsStudio.scene);
	whiteGridMat.emissiveColor = new BABYLON.Color3(1,1,1);
	
	var blueGridMat = new BABYLON.StandardMaterial("blueGrid", jccsStudio.scene);
	blueGridMat.emissiveColor = new BABYLON.Color3(0.2,0.2,1);
	
	var redGridMat = new BABYLON.StandardMaterial("red", jccsStudio.scene);
	redGridMat.emissiveColor = new BABYLON.Color3(1,0.2,0.2);
	
	var yellowGridMat = new BABYLON.StandardMaterial("blueGrid", jccsStudio.scene);
	yellowGridMat.emissiveColor = new BABYLON.Color3(1,1,0);
	
	var brownGridMat = new BABYLON.StandardMaterial("red", jccsStudio.scene);
	brownGridMat.emissiveColor = new BABYLON.Color3(0.4,0.2,0);
	
	var blueMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
	blueMat.emissiveColor = new BABYLON.Color3(0,0,1);
	
	var redMat = new BABYLON.StandardMaterial("red", jccsStudio.scene);
	redMat.emissiveColor = new BABYLON.Color3(1,0,0);
	
	var blackMat = new BABYLON.StandardMaterial("black", jccsStudio.scene);
	blackMat.emissiveColor = new BABYLON.Color3(0,0,0);
	
	//Create Ground
	var ground=BABYLON.Mesh.CreateGround("ground",1200, 1200, 20, jccsStudio.scene,  false, BABYLON.Mesh.DOUBLESIDE);	
	ground.material = greenGridMat;
	ground.material.wireframe=true;
	ground.position.y = 0;
	ground.position.z=1;

	//Create Planes for each side	
	var backPlane=BABYLON.Mesh.CreateGround("backPlane",1200, 1200, 20, jccsStudio.scene);	
	backPlane.material = yellowGridMat;
	backPlane.material.wireframe=true;
	backPlane.rotation.x = Math.PI/2;
	backPlane.position.x=0;
	backPlane.position.y=600;
	backPlane.position.z=600;
	backPlane.isPickable = false;	
	
	var leftSidePlane=BABYLON.Mesh.CreateGround("leftSidePlane",1200, 1200, 20, jccsStudio.scene);	
	leftSidePlane.material = blueGridMat;
	leftSidePlane.material.wireframe=true;
	leftSidePlane.rotation.z = Math.PI/2;
	leftSidePlane.position.x=-600;
	leftSidePlane.position.y=600;
	leftSidePlane.position.z=0;
	leftSidePlane.isPickable = false;
	
	var frontPlane=BABYLON.Mesh.CreateGround("frontPlane",1200, 1200, 20, jccsStudio.scene);	
	frontPlane.material = brownGridMat;
	frontPlane.material.wireframe=true;
	frontPlane.rotation.x = Math.PI/2;
	frontPlane.position.x=0;
	frontPlane.position.y=600;
	frontPlane.position.z=-600;
	frontPlane.isPickable = false;
	frontPlane.visibility = 0;

	var rightSidePlane=BABYLON.Mesh.CreateGround("rightSidePlane",1200, 1200, 20, jccsStudio.scene);	
	rightSidePlane.material = redGridMat;
	rightSidePlane.material.wireframe=true;
	rightSidePlane.rotation.z = Math.PI/2;
	rightSidePlane.position.x=600;
	rightSidePlane.position.y=600;
	rightSidePlane.position.z=0;	
	rightSidePlane.isPickable = false;

	
	//Make Cubees  L prefix for Live Cubee
	function makeBox() {
		var name = "L"+currentModelName+"¬box"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeBox(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);		
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;		
	}
	
	function makeCylinder() {
		var name = "L"+currentModelName+"¬cylinder"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeCylinder(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function makeSphere() {
		var name = "L"+currentModelName+"¬sphere"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeSphere(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}

	function makeRoof() {
		var name = "L"+currentModelName+"¬roof"+(num_of_boxes++);
		var boxMat = new BABYLON.StandardMaterial("blue", jccsStudio.scene);
		boxMat.emissiveColor = new BABYLON.Color3(colour.colarray[0]/255,colour.colarray[1]/255,colour.colarray[2]/255);
		JCubees[name]= new JcubeeRoof(name, 30, 30 + 13*60, 30, boxMat, jccsStudio.scene);
		JCubees[name].addMarkers(jccsStudio.scene);
		hideSubMenus();
		resetBorders();		
		selection.style.color="#000000";		
		selectNew(JCubees[name].Jcubee);
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	//select new cubee
	function selectNew(cubee) {
		currentMeshes = {};
		//currentMaterials = {};
		currentMeshes[cubee.name] = cubee;
		for(var mesh in JCubees) {						
			if(!(mesh in currentMeshes)) {						
				JCubees[mesh].Jcubee.material.alpha = 0.5;
				JCubees[mesh].hideMarkers();
			}
		}
	}
	
	function selectNewModel(scene_model) {
		currentParents = {};		
		currentParents[scene_model.name] = scene_model;
		for(var model in sceneParents) {		
			if(!(model in currentParents))	{					
				for(var i=0; i<modelChildren[model].length;i++) {
					modelChildren[model][i].Jcubee.material.alpha = 0.5;
					modelChildren[model][i].hideMarkers();					
				}
			}
		}
	}
		
	// Register a render loop to repeatedly render the scene
	jcEngine.runRenderLoop(function () {			
		jccsStudio.scene.render();
	}); 
	
	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		jcEngine.resize();
	});
	
	// Events

    var getGroundPosition = function () {
        // Use a predicate to get position on the ground
        var pickinfo = jccsStudio.scene.pick(jccsStudio.scene.pointerX, jccsStudio.scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    };

    var onPointerDown = function (evt) {		
        if (evt.button !== 0) {
            return;
        };

        // check if we are under a pickable mesh			
        var pickInfo = jccsStudio.scene.pick(jccsStudio.scene.pointerX, jccsStudio.scene.pointerY);	
		if (pickInfo.hit && pickInfo.pickedMesh !==ground) {	
            var currentMesh = pickInfo.pickedMesh;
			var name = currentMesh.name;			
			if(name.charAt(0)=="I") {
				var currentParent = sceneModels[name].Jcubee.parent;
				name = currentParent.name;
				updateCurrentModels()
			}
			else {
				updateCurrentMeshes();
			}												
			
            groundPoint = getGroundPosition(evt);

            if (groundPoint) { // we need to disconnect jccsStudio.camera from jcCanvas
                setTimeout(function () {
                    jccsStudio.camera.detachControl(jcCanvas);
                }, 0);
            }
        }
        
         function updateCurrentMeshes() {
			if(shiftDown) {
				if(name in currentMeshes) {
					currentMeshes[name].material.alpha = 0.5;
					JCubees[name].hideMarkers();
					delete currentMeshes[name];
				}
				else {
					currentMeshes[name] = currentMesh;
					currentMesh.material.alpha = 1;	
					JCubees[name].showMarkers();					
				}
			}
			else {			
				for(var mesh in JCubees) {						
					JCubees[mesh].Jcubee.material.alpha = 1;
					JCubees[mesh].hideMarkers();
				}			
				currentMeshes = {};
				//currentMaterials = {}; 
				currentMeshes[name] = currentMesh;
				JCubees[name].showMarkers();
				for(var mesh in JCubees) {						
					if(!(mesh in currentMeshes)) {						
						JCubees[mesh].Jcubee.material.alpha = 0.5;
					}
				}
			}
			if(selection.innerHTML == "Select All") {
				selection.innerHTML = "Selection";
			}
			selection.style.color="#000000";
		}

		function updateCurrentModels() {
			if(shiftDown) {
				if(name in currentParents) {
					//currentParents[name].material.alpha = 0.5;
					delete currentParents[name];
				}
				else {
					currentParents[name] = currentParent;
					//currentParent.material.alpha = 1;						
				}
			}
			else {			
				for(var model in sceneParents) {						
					for(var i=0; i<modelChildren[model].length;i++) {
						modelChildren[model][i].Jcubee.material.alpha = 1;
					}
				}			
				currentParents = {}; 
				currentParents[name] = currentParent;
				for(var model in sceneParents) {						
					if(!(model in currentParents)) {						
						for(var i=0; i<modelChildren[model].length;i++) {
						modelChildren[model][i].Jcubee.material.alpha = 0.5;
						}
					}
				}
			}
			if(scene_selection.innerHTML == "Select All") {
				scene_selection.innerHTML = "Selection";
			}
			scene_selection.style.color="#000000";
		} 
   };

    var onPointerUp = function () {	
		hideSubMenus();
		scene_hideSubMenus();
		
        if (groundPoint) {
            jccsStudio.camera.attachControl(jcCanvas, true);
            groundPoint = null;
            return;
        }
		
		if(currentMeshes === {}) {
			selection.innerHTML = "Select All";
			selection.style.color="#000000";
		}
		
		if(JCubees === {} ) {
			selection.innerHTML = "Selection";
			selection.style.color="rgb(136, 136, 136)"
		}
		
		if(currentParents === {}) {
			scene_selection.innerHTML = "Select All";
			scene_selection.style.color="#000000";
		}
		
		if(sceneParents === {} ) {
			scene_selection.innerHTML = "Selection";
			scene_selection.style.color="rgb(136, 136, 136)"
		}
		
    };
      
	
	var onPointerMove = function() {
		jccsStudio.camera.alpha +=2*Math.PI;
		jccsStudio.camera.alpha %=2*Math.PI;			
		if(1.9<jccsStudio.camera.alpha && jccsStudio.camera.alpha<4.4) {
			leftSidePlane.visibility = 0;
		}
		else {
			leftSidePlane.visibility = 1;
		}
		if(0.25<jccsStudio.camera.alpha && jccsStudio.camera.alpha<3.1) {
			backPlane.visibility = 0;
		}
		else {
			backPlane.visibility = 1;
		} 
		if((0<jccsStudio.camera.alpha && jccsStudio.camera.alpha<1.4)  || (4.9<jccsStudio.camera.alpha && jccsStudio.camera.alpha<6.5)) {
			rightSidePlane.visibility = 0;
		}
		else {
			rightSidePlane.visibility = 1;
		}	
		if(3.4<jccsStudio.camera.alpha && jccsStudio.camera.alpha<5.9) {
			frontPlane.visibility = 0;
		}
		else {
			frontPlane.visibility = 1;
		}
	};
	
	var onKeyDown = function(evt) {

	
		if(evt.keyCode == 16) {
			if(!shiftDown) {
				shiftDown=true;
			}
		};
	
		if(evt.keyCode==39) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				rightModelMove();
			}
			else {
				rightMove();
			}
			return;
		};
		
		if(evt.keyCode==37) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				leftModelMove();
			}
			else {
				leftMove();
			}
			return;
		}
		
		if(evt.keyCode==40) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				downModelMove();
			}
			else {
				downMove();
			}
			return;
		}
		
		if(evt.keyCode==38) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				upModelMove();
			}
			else {
				upMove();
			}			
			return;
		}
		
		if(evt.keyCode==190) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				forwardModelMove();
			}
			else {
				forwardMove();
			}			
			return;
		}
		
		if(evt.keyCode==188) {
			if(!detached) {
				jccsStudio.camera.detachControl(jcCanvas);
				detached = true;
			}
			if(inScene) {
				backModelMove();
			}
			else {
				backMove();
			}			
			return;
		}
	};
	
	var onKeyUp = function () {
        if (detached) {
			detached = false;
            jccsStudio.camera.attachControl(jcCanvas, true);
            return;
        }
		shiftDown = false;
    }
	
	function rightMove() {
		if(stepsLeftRight(JCubees, currentMeshes).right>0) {
			var diff = moveRight;
			for(var name in currentMeshes) {			
				currentMeshes[name].position.addInPlace(diff);			
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function leftMove() {
		if(stepsLeftRight(JCubees, currentMeshes).left>0) {
			var diff = moveLeft;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function upMove() {
		if(stepsUpDown(JCubees, currentMeshes).up>0) {
			var diff = moveUp;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function downMove() {
		if(stepsUpDown(JCubees, currentMeshes).down>0) {
			var diff = moveDown;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].getAbsolutePosition());
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;	
	}
	
	function forwardMove() {
		if(stepsForwardBack(JCubees, currentMeshes).forward>0) {
			var diff = moveForward;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function backMove() {
		if(stepsForwardBack(JCubees, currentMeshes).back>0) {
			var diff = moveBackward;
			for(var name in currentMeshes) {
				currentMeshes[name].position.addInPlace(diff);
				JCubees[name].moveT(currentMeshes[name].position);
			}
		}
		model.innerHTML = "Model -- "+currentModelName+storeIcon+saveIcon+exportIcon;;
		JCisStored = false;
	}
	
	function leftModelMove() {
		var diff = moveLeft.scale(0.5);
		for(var name in currentParents) {			
			currentParents[name].position.addInPlace(diff);			
			for(var i=0; i<modelChildren[name].length;i++) {
				modelChildren[name][i].moveT(modelChildren[name][i].Jcubee.getAbsolutePosition());
			}
		}
	}
	
	function rightModelMove() {
		var diff = moveRight.scale(0.5);
		for(var name in currentParents) {
			currentParents[name].position.addInPlace(diff);
			for(var i=0; i<modelChildren[name].length;i++) {
				modelChildren[name][i].moveT(modelChildren[name][i].Jcubee.getAbsolutePosition());
			}			
		}
	}
	
	function upModelMove() {
		var diff = moveUp.scale(0.5);
		for(var name in currentParents) {
			currentParents[name].position.addInPlace(diff);
			for(var i=0; i<modelChildren[name].length;i++) {
				modelChildren[name][i].moveT(modelChildren[name][i].Jcubee.getAbsolutePosition());
			}			
		}
	}
	
	function downModelMove() {
		var diff = moveDown.scale(0.5);
		for(var name in currentParents) {
			currentParents[name].position.addInPlace(diff);
			for(var i=0; i<modelChildren[name].length;i++) {
				modelChildren[name][i].moveT(modelChildren[name][i].Jcubee.getAbsolutePosition());
			}			
		}
	}
	
	function backModelMove() {
		var diff = moveBackward.scale(0.5);
		for(var name in currentParents) {
			currentParents[name].position.addInPlace(diff);
			for(var i=0; i<modelChildren[name].length;i++) {
				modelChildren[name][i].moveT(modelChildren[name][i].Jcubee.getAbsolutePosition());
			}			
		}
	}
	
	function forwardModelMove() {
		var diff = moveForward.scale(0.5);
		for(var name in currentParents) {
			currentParents[name].position.addInPlace(diff);
			for(var i=0; i<modelChildren[name].length;i++) {
				modelChildren[name][i].moveT(modelChildren[name][i].Jcubee.getAbsolutePosition());
			}			
		}
	}

    jcCanvas.addEventListener("mousedown", onPointerDown, false);
    jcCanvas.addEventListener("mouseup", onPointerUp, false);
	jcCanvas.addEventListener("mousemove", onPointerMove, false);
	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("keyup", onKeyUp, false);
	

    jccsStudio.scene.onDispose = function () {
        jcCanvas.removeEventListener("mousedown", onPointerDown);
        jcCanvas.removeEventListener("mouseup", onPointerUp);
		window.removeEventListener("keydown", onKeyDown, false);
		window.removeEventListener("keyup", onKeyUp, false);
    }

}

