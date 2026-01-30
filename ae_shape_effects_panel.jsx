/*
Shape Effects Library Panel
For Adobe After Effects (ExtendScript)
*/
(function shapeEffectsPanel(thisObj) {
  var EFFECTS = [
    {
      id: "pulse_circle",
      name: "Pulse Circle",
      description: "Animated scale pulse on a circular shape with fill.",
    },
    {
      id: "trim_path_stroke",
      name: "Trim Path Stroke",
      description: "Animated trim paths on a stroked line.",
    },
    {
      id: "repeater_burst",
      name: "Repeater Burst",
      description: "Repeater-based burst with rotating rectangles.",
    },
    {
      id: "wiggle_stroke",
      name: "Wiggle Stroke",
      description: "Wiggling stroke with a subtle position wiggle.",
    },
    {
      id: "morphing_path",
      name: "Morphing Path",
      description: "Morph between two custom shapes.",
    },
  ];

  function getActiveComp() {
    if (app.project === null) {
      return null;
    }
    var item = app.project.activeItem;
    if (item && item instanceof CompItem) {
      return item;
    }
    return null;
  }

  function createPrecompForEffect(parentComp, effectName) {
    var name = "Shape Effect - " + effectName;
    var duration = parentComp.duration;
    var comp = app.project.items.addComp(
      name,
      parentComp.width,
      parentComp.height,
      parentComp.pixelAspect,
      duration,
      parentComp.frameRate
    );
    return comp;
  }

  function addBasicShapeGroup(layer) {
    var contents = layer.property("Contents");
    var group = contents.addProperty("ADBE Vector Group");
    group.name = "Shape 1";
    return group.property("Contents");
  }

  function addFill(shapeGroup, color) {
    var fill = shapeGroup.addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue(color);
    return fill;
  }

  function addStroke(shapeGroup, color, width) {
    var stroke = shapeGroup.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue(color);
    stroke.property("Stroke Width").setValue(width);
    return stroke;
  }

  function addEllipse(shapeGroup, size) {
    var ellipse = shapeGroup.addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("ADBE Vector Ellipse Size").setValue([size, size]);
    return ellipse;
  }

  function addRectangle(shapeGroup, size) {
    var rect = shapeGroup.addProperty("ADBE Vector Shape - Rect");
    rect.property("ADBE Vector Rect Size").setValue([size, size]);
    rect.property("ADBE Vector Rect Roundness").setValue(10);
    return rect;
  }

  function addCustomPath(shapeGroup, vertices) {
    var path = shapeGroup.addProperty("ADBE Vector Shape - Group");
    var shape = new Shape();
    shape.vertices = vertices;
    shape.inTangents = [[0, 0], [0, 0], [0, 0], [0, 0]];
    shape.outTangents = [[0, 0], [0, 0], [0, 0], [0, 0]];
    shape.closed = true;
    path.property("ADBE Vector Shape").setValue(shape);
    return path;
  }

  function applyPulseCircle(comp) {
    var layer = comp.layers.addShape();
    layer.name = "Pulse Circle";
    var group = addBasicShapeGroup(layer);
    addEllipse(group, 400);
    addFill(group, [0.1, 0.7, 0.9]);

    var scaleProp = layer.property("Transform").property("Scale");
    scaleProp.setValuesAtTimes([0, comp.duration * 0.5, comp.duration], [
      [50, 50],
      [120, 120],
      [50, 50],
    ]);
    scaleProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
    scaleProp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
    scaleProp.setInterpolationTypeAtKey(3, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);

    layer.property("Transform").property("Position").setValue([
      comp.width / 2,
      comp.height / 2,
    ]);
  }

  function applyTrimPath(comp) {
    var layer = comp.layers.addShape();
    layer.name = "Trim Path";
    var group = addBasicShapeGroup(layer);
    addRectangle(group, 500);
    addStroke(group, [1, 1, 1], 12);

    var trim = group.addProperty("ADBE Vector Filter - Trim");
    var endProp = trim.property("End");
    endProp.setValuesAtTimes([0, comp.duration * 0.8], [0, 100]);

    layer.property("Transform").property("Position").setValue([
      comp.width / 2,
      comp.height / 2,
    ]);
  }

  function applyRepeaterBurst(comp) {
    var layer = comp.layers.addShape();
    layer.name = "Repeater Burst";
    var group = addBasicShapeGroup(layer);
    addRectangle(group, 80);
    addFill(group, [0.95, 0.5, 0.2]);

    var repeater = group.addProperty("ADBE Vector Filter - Repeater");
    repeater.property("Copies").setValue(24);
    var repeaterTransform = repeater.property("Transform");
    repeaterTransform.property("Rotation").setValue(15);
    repeaterTransform.property("Position").setValue([0, 150]);

    var rotationProp = layer.property("Transform").property("Rotation");
    rotationProp.setValuesAtTimes([0, comp.duration], [0, 360]);

    layer.property("Transform").property("Position").setValue([
      comp.width / 2,
      comp.height / 2,
    ]);
  }

  function applyWiggleStroke(comp) {
    var layer = comp.layers.addShape();
    layer.name = "Wiggle Stroke";
    var group = addBasicShapeGroup(layer);
    addEllipse(group, 500);
    addStroke(group, [0.8, 0.9, 0.3], 8);

    var positionProp = layer.property("Transform").property("Position");
    positionProp.expression = "wiggle(2, 40);";

    layer.property("Transform").property("Position").setValue([
      comp.width / 2,
      comp.height / 2,
    ]);
  }

  function applyMorphingPath(comp) {
    var layer = comp.layers.addShape();
    layer.name = "Morphing Path";
    var group = addBasicShapeGroup(layer);
    var path = addCustomPath(group, [
      [-150, -150],
      [150, -150],
      [150, 150],
      [-150, 150],
    ]);
    addFill(group, [0.6, 0.3, 0.9]);

    var pathProp = path.property("ADBE Vector Shape");
    var shape2 = new Shape();
    shape2.vertices = [
      [0, -200],
      [200, 0],
      [0, 200],
      [-200, 0],
    ];
    shape2.inTangents = [[0, 0], [0, 0], [0, 0], [0, 0]];
    shape2.outTangents = [[0, 0], [0, 0], [0, 0], [0, 0]];
    shape2.closed = true;

    pathProp.setValueAtTime(0, pathProp.value);
    pathProp.setValueAtTime(comp.duration * 0.8, shape2);

    layer.property("Transform").property("Position").setValue([
      comp.width / 2,
      comp.height / 2,
    ]);
  }

  function applyEffectById(comp, effectId) {
    switch (effectId) {
      case "pulse_circle":
        applyPulseCircle(comp);
        break;
      case "trim_path_stroke":
        applyTrimPath(comp);
        break;
      case "repeater_burst":
        applyRepeaterBurst(comp);
        break;
      case "wiggle_stroke":
        applyWiggleStroke(comp);
        break;
      case "morphing_path":
        applyMorphingPath(comp);
        break;
      default:
        applyPulseCircle(comp);
        break;
    }
  }

  function importEffect(effect) {
    var parentComp = getActiveComp();
    if (!parentComp) {
      alert("Please select an active composition.");
      return;
    }

    app.beginUndoGroup("Import Shape Effect");

    var precomp = createPrecompForEffect(parentComp, effect.name);
    applyEffectById(precomp, effect.id);

    var layer = parentComp.layers.add(precomp);
    layer.startTime = parentComp.time;

    app.endUndoGroup();
  }

  function buildUI(thisObj) {
    var win = thisObj instanceof Panel ? thisObj : new Window("palette", "Shape Effects", undefined, {
      resizeable: true,
    });

    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    var listGroup = win.add("panel", undefined, "Effects");
    listGroup.alignChildren = ["fill", "fill"];
    listGroup.preferredSize.height = 180;

    var listBox = listGroup.add("listbox", undefined, EFFECTS.map(function (item) {
      return item.name;
    }));
    listBox.selection = 0;

    var previewPanel = win.add("panel", undefined, "Preview");
    previewPanel.alignChildren = ["fill", "top"];
    previewPanel.preferredSize.height = 120;

    var previewText = previewPanel.add("statictext", undefined, EFFECTS[0].description, {
      multiline: true,
    });

    var buttonGroup = win.add("group");
    buttonGroup.alignment = ["fill", "top"];

    var importButton = buttonGroup.add("button", undefined, "Import to Comp");

    listBox.onChange = function () {
      var idx = listBox.selection ? listBox.selection.index : 0;
      previewText.text = EFFECTS[idx].description;
    };

    importButton.onClick = function () {
      var idx = listBox.selection ? listBox.selection.index : 0;
      importEffect(EFFECTS[idx]);
    };

    win.layout.layout(true);
    win.layout.resize();
    win.onResizing = win.onResize = function () {
      this.layout.resize();
    };

    if (win instanceof Window) {
      win.center();
      win.show();
    }

    return win;
  }

  buildUI(thisObj);
})(this);
