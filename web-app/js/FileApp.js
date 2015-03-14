/**
 * CMSC495
 * File Storage Application
 * Group C
 *
 * Kenneth J Ellis
 * Justin Paul Hill
 * Ian Levi Nelson
 */

// File view.
Ext.define('FileApp', {

	extend: 'Ext.grid.Panel',
	alias: 'fileapp',

	// Initialize component.
	initComponent: function () {
		Ext.apply(this, {
			title: 'Files',
			selType: 'rowmodel',
			listeners: {
				afterrender: {
					fn: Ext.Function.bind(this.handler_ShowLoginWindow, this)
				},
				loadstore: {
					fn: Ext.Function.bind(this.handler_LoadStore, this)
				}
			}
		});

		// Create grid model, store, and columns.
		this.model = this.createModel();
		this.store = this.createStore(this.model);
		this.columns = this.createColumns();

		// Create the login window.
		this.loginWindow = this.createLoginWindow();

		// Create the user view and associated internal window.
		this.userApp = this.createUserApp();
		this.userAdminWindow = this.createUserAdminWindow(this.userApp);

		// Create the file upload component and window.
		this.fileUpload = this.createFileUpload();
		this.fileUploadWindow = this.createFileUploadWindow(this.fileUpload);

		// Create a toolbar.
		this.tbar = Ext.create('Ext.toolbar.Toolbar', {
			items: [{
				xtype: 'button',
				text: 'Upload File',
				iconCls: 'btn-upload',
				handler: Ext.Function.bind(this.handler_UploadFile, this)
			},{
				xtype: 'button',
				text: 'Download File',
				iconCls: 'btn-download',
				handler: Ext.Function.bind(this.handler_DownloadFile, this)
			},{
				xtype: 'button',
				text: 'Delete File',
				iconCls: 'btn-delete',
				handler: Ext.Function.bind(this.handler_DeleteFile, this)
			},{
				xtype: 'label',
				id: 'quota-label',
				text: '0 MB used of 0 MB'

			},'->', {
				xtype: 'button',
				id: 'user-admin-btn',
				text: 'User Admin',
				disabled: true,
				iconCls: 'btn-admin',
				handler: Ext.Function.bind(this.handler_UserAdmin, this)
			},{
				xtype: 'button',
				text: 'Logout',
				iconCls: 'btn-logout',
				handler: Ext.Function.bind(this.handler_Logout, this)
			}]
		});

		// Assign reusable buttons to internal scope.
		this.userAdminBtn = Ext.getCmp('user-admin-btn');
		this.quotaDesc = Ext.getCmp('quota-label');

		// Call superclass.
		return this.callParent(arguments);
	},

	// Create the file data model.
	createModel: function () {
		var modelName = 'Files';

		Ext.define(modelName, {
			extend: 'Ext.data.Model',
			fields: [{
				name: 'name',
				type: 'string'
			},{
				name: 'size',
				type: 'int'
			},{
				name: 'uuid',
				type: 'string'
			}]
		});
		return modelName;
	},

	// Create the file data store.
	createStore: function (model) {
		var store = Ext.create('Ext.data.Store', {
			model: model,
			proxy: {
				type: 'ajax',
				url: 'file',
				reader: {
					type: 'json',
					root: 'results'
				}
			}
		});
		return store;
	},

	// Create the grid columns.
	createColumns: function () {
		var columns = [{
			header: 'Name',
			dataIndex: 'name',
			width: 300
		},{
			header: 'Size (MB)',
			dataIndex: 'size',
			renderer: Ext.Function.bind(this.renderer_AdjustSize, this)
		}];
		return columns;
	},

	// Create the file upload form panel.
	createFileUpload: function () {
		var uploadForm = Ext.create('Ext.form.Panel', {
			url: 'upload',
			id: 'upload-form',
			items: [{
				width: 250,
				name: 'file',
				fieldLabel: 'File',
				xtype: 'filefield',
				allowBlank: false
			}],
			buttons: [{
				xtype: 'button',
				text: 'Upload',
				handler: Ext.Function.bind(this.handler_UploadFileToService, this)
			}]
		});
		return uploadForm;
	},

	// Event handler to do a MultiPartFile form upload to REST service.
	handler_UploadFileToService: function () {
		this.fileUpload.getForm().submit({
			success: Ext.Function.bind(this.handler_SuccessfulUpload, this),
			failure: Ext.Function.bind(this.handler_FailedUpload, this)
		});
	},

	// Event handler to update quota and reload saved file.
	handler_SuccessfulUpload: function (form, action) {
		this.fileUploadWindow.hide();
		var used = action.result.used / 1000000;
		var quota = action.result.quota / 1000000;
		this.quotaDesc.setText(used.toFixed(2) + ' MB used of ' + quota.toFixed(2) + ' MB');
		this.fireEvent('loadstore');
	},

	// Event handler to notify of a failure in uploading file.
	handler_FailedUpload: function (form, action) {
		alert(action.result.msg);
	},

	// Create a window to show file upload form.
	createFileUploadWindow: function (uploadForm) {
		var win = Ext.create('Ext.window.Window', {
			title: 'Login',
			closable: true,
			minimizable: false,
			modal: true,
			layout: {
				type: 'fit'
			},
			closeAction: 'hide',
			items: [uploadForm]
		});
		return win;
	},

	// Create a login window.
	createLoginWindow: function () {
		var win = Ext.create('Ext.window.Window', {
			title: 'Login',
			closable: false,
			minimizable: false,
			modal: true,
			layout: {
				type: 'fit'
			},
			items: [{
				xtype: 'form',
				url: 'login',
				id: 'login-form',
				items: [{
					width: 250,
					name: 'email',
					fieldLabel: 'Email',
					xtype: 'textfield',
					inputType: 'text',
					allowBlank: false
				},{
					width: 250,
					name: 'password',
					fieldLabel: 'Password',
					xtype: 'textfield',
					inputType: 'password',
					allowBlank: false
				}]
			}],
			buttons: [{
				text: 'Login',
				scope: this,
				handler: function () {
					var form = Ext.getCmp('login-form').getForm();
					form.submit({
						success: Ext.Function.bind(this.handler_ValidSession, this),
						failure: Ext.Function.bind(this.handler_InvalidSession, this)
					});
				}
			}]
		});
		return win;
	},

	// Create the user administration view.
	createUserApp: function () {
		var userApp = Ext.create('UserApp');
		return userApp;
	},

	// Create the user administration wrapping window.
	createUserAdminWindow: function (userApp) {
		var win = Ext.create('Ext.window.Window', {
			title: 'User Administration',
			iconCls: 'btn-admin',
			width: 450,
			height: 375,
			closeAction: 'hide',
			modal: true,
			layout: 'fit',
			items: [userApp]
		});
		return win;
	},

	// Cell renderer to format bytes to megabytes.
	renderer_AdjustSize: function (value) {
		return (value / 1000000).toFixed(4);
	},

	// Event handler to show login window once authenticated.
	handler_ShowLoginWindow: function () {
		this.loginWindow.show();
	},

	// Event handler to adjust quota and user administration button when authenticated.
	// Also loads store with user's files.
	handler_ValidSession: function (form, action) {
		this.loginWindow.hide();

		var used = action.result.used / 1000000;
		var quota = action.result.quota / 1000000;

		this.quotaDesc.setText(used.toFixed(2) + ' MB used of ' + quota.toFixed(2) + ' MB');
		this.userAdminBtn.setDisabled(!action.result.isAdmin);
		
		this.fireEvent('loadstore');
		this.userApp.fireEvent('loadstore');
	},

	// Event handler to notify of a failed authentication.
	handler_InvalidSession: function (form, action) {
		alert(action.result.msg);
	},

	// Event handler to reload data store with user's files.
	handler_LoadStore: function () {
		this.store.load();
	},

	// Event handler to show user administration window.
	handler_UserAdmin: function () {
		this.userAdminWindow.show();
	},

	// Event handler to show upload form window.
	handler_UploadFile: function () {
		this.fileUploadWindow.show();
	},

	// Event handler to get selected file, and make REST call to delete.
	handler_DeleteFile: function () {
		// Get selection from the row.
		var file = this.getSelectionModel().getSelection();
		if (!file.length) {return;}

		// Get the UUID from the file in the array.
		var selectedFile = file[0];
		var uuid = selectedFile.get('uuid');

		// Make REST request.
		Ext.Ajax.request({
			url: 'file/' + uuid,
			method: 'DELETE',
			success: Ext.Function.bind(this.handler_FileDeleted, this)
		});
	},

	// Event handler to reload file data store upon file delete.
	handler_FileDeleted: function () {
		this.fireEvent('loadstore');
	},

	// Event handler to redirect to file content for a download.
	handler_DownloadFile: function () {
		// Get the user's row selection
		var file = this.getSelectionModel().getSelection();

		// If nothing selected, return.
		if (!file.length) {return;}

		// Get the UUID from the file in the array.
		var selectedFile = file[0];
		var uuid = selectedFile.get('uuid');

		// Redirect the browser to the REST service.
		document.location = 'file/' + uuid;
	},

	// Event handler to logout.
	handler_Logout: function () {
		// Sets user administration button to disabled.
		this.userAdminBtn.setDisabled(true);
		
		// Redirect browser to logout REST service.
		document.location = 'logout/';
	}
});