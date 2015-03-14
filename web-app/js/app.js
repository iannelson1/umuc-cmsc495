Ext.application({
    name: 'FileApp',

    launch: function() {
	    var fileApp = Ext.create('FileApp');

        Ext.create('Ext.container.Viewport', {
	        layout: {
		        type: 'fit'
	        },
	        items: [fileApp]
        });
    }
});