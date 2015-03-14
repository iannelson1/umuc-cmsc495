/**
 * CMSC495
 * File Storage Application
 * Group C
 *
 * Kenneth J Ellis
 * Justin Paul Hill
 * Ian Levi Nelson
 */

// Create the user administration view.
Ext.define('UserApp', {
	extend: 'Ext.grid.Panel',
	alias: 'userapp',

	// Initializes component.
	initComponent: function () {
		Ext.apply(this, {
			listeners: {
				loadstore: {
					fn: Ext.Function.bind(this.handler_LoadStore, this)
				}
			}
		});

		// Create model, store, and columns for grid.
		this.model = this.createModel();
		this.store = this.createStore(this.model);
		this.columns = this.createColumns();

		// Create toolbar.
		this.tbar = Ext.create('Ext.toolbar.Toolbar', {
			items: [{
				xtype: 'button',
				text: 'Create User',
				iconCls: 'btn-create',
				handler: Ext.Function.bind(this.btnHandler_CreateUser, this)
			},{
				xtype: 'button',
				text: 'Delete User',
				iconCls: 'btn-delete',
				handler: Ext.Function.bind(this.btnHandler_DeleteUser, this)
			},{
				xtype: 'button',
				text: 'Edit User',
				iconCls: 'btn-edit',
				handler: Ext.Function.bind(this.btnHandler_EditUser, this)
			}]
		});

		return this.callParent(arguments);
	},

	// Create the user data model.
	createModel: function () {
		var modelName = 'Users';

		Ext.define(modelName, {
			extend: 'Ext.data.Model',
			fields: [{
				name: 'firstName',
				type: 'string'
			},{
				name: 'lastName',
				type: 'string'
			},{
				name: 'email',
				type: 'string'
			},{
				name: 'quota',
				type: 'int'
			},{
				name: 'uuid',
				type: 'string'
			}]
		});
		return modelName;
	},

	// Create user data store.
	createStore: function (model) {
		var store = Ext.create('Ext.data.Store', {
			model: model,
			proxy: {
				type: 'ajax',
				url: 'user',
				reader: {
					type: 'json',
					root: 'results'
				}
			}
		});
		return store;
	},

	// Create grid columns.
	createColumns: function () {
		var columns = [{
			header: 'First Name',
			dataIndex: 'firstName'
		},{
			header: 'Last Name',
			dataIndex: 'lastName'
		},{
			header: 'Email',
			dataIndex: 'email'
		},{
			header: 'Quota',
			dataIndex: 'quota',
			renderer: Ext.Function.bind(this.renderer_AdjustSize, this)
		}];
		return columns;
	},

	// Generic event handler to data from REST service.
	handler_LoadStore: function () {
		this.store.load();
	},

	// Button handler to show a window to create a user.
	btnHandler_CreateUser: function () {
		var win = Ext.create('Ext.window.Window', {
			id: 'create-user-win',
			title: 'Create User',
			iconCls: 'btn-create',
			layout: {
				type: 'fit'
			},
			items: [{
				xtype: 'form',
				id: 'create-user',
				buttonAlign: 'center',
				items: [{
					xtype: 'textfield',
					fieldLabel: 'First Name',
					name: 'firstName',
					allowBlank: false
				},{
					xtype: 'textfield',
					fieldLabel: 'Last Name',
					name: 'lastName',
					allowBlank: false
				},{
					xtype: 'textfield',
					fieldLabel: 'Email',
					name: 'email',
					allowBlank: false
				},{
					xtype: 'textfield',
					fieldLabel: 'Password',
					inputType: 'password',
					name: 'password',
					allowBlank: false
				},{
					xtype: 'checkboxfield',
					id: 'create-is-admin',
					fieldLabel: 'Is Admin',
					name: 'isAdmin',
					value: false
				}]
			}],
			buttons: [{
				xtype: 'button',
				text: 'Create',
				handler: Ext.Function.bind(this.handler_CreateUser, this)
			}]
		}).show();
	},

	// Handler to send new user data to REST service.
	handler_CreateUser: function () {
		var params = Ext.getCmp('create-user').getForm().getValues();
		params.isAdmin = Ext.getCmp('create-is-admin').getValue();
		Ext.getCmp('create-user-win').hide();
		
		Ext.Ajax.request({
			url: 'user',
			params: params,
			method: 'POST',
			success: Ext.Function.bind(this.handler_LoadStore, this)
		});
	},

	// Button handler to delete a user by row selection.
	btnHandler_DeleteUser: function () {
		// Get selection from the row.
		var user = this.getSelectionModel().getSelection();
		if (!user.length) {return;}

		// Get the UUID from the user in the array.
		var selectedUser = user[0];
		var uuid = selectedUser.get('uuid');

		Ext.Ajax.request({
			url: 'user/' + uuid,
			method: 'DELETE',
			success: Ext.Function.bind(this.handler_LoadStore, this)
		});
	},

	// Button handler to edit a user by row selection.
	btnHandler_EditUser: function () {
		// Get selection from the row.
		var user = this.getSelectionModel().getSelection();
		if (!user.length) {return;}

		// Get the UUID from the user in the array.
		var selectedUser = user[0];
		var uuid = selectedUser.get('uuid');

		Ext.Ajax.request({
			url: 'user/' + uuid,
			method: 'GET',
			success: Ext.Function.bind(this.handler_EditUser, this)
		});
	},

	// Event handler to show edit dialog after details are loaded from REST service.
	handler_EditUser: function (response) {
		var responseObj = Ext.decode(response.responseText);
		var userInfo = responseObj.results[0]

		var win = Ext.create('Ext.window.Window', {
			id: 'edit-user-win',
			title: 'Edit User',
			iconCls: 'btn-edit',
			layout: {
				type: 'fit'
			},
			closeAction: 'destroy',
			items: [{
				xtype: 'form',
				id: 'edit-user',
				buttonAlign: 'center',
				items: [{
					xtype: 'textfield',
					fieldLabel: 'Quota',
					name: 'quota',
					allowBlank: false,
					value: userInfo.quota
				},{
					xtype: 'checkboxfield',
					fieldLabel: 'Is Admin',
					name: 'isAdmin',
					value: userInfo.isAdmin
				},{
					xtype: 'hidden',
					name: 'uuid',
					value: userInfo.uuid
				}]
			}],
			buttons: [{
				xtype: 'button',
				text: 'Update',
				handler: Ext.Function.bind(this.handler_SaveEditedUser, this)
			}]
		}).show();
	},

	// Event handler to persist user changes to REST service.
	handler_SaveEditedUser: function () {
		var params = Ext.getCmp('edit-user').getForm().getValues();
		Ext.getCmp('edit-user-win').destroy();

		var uuid = params.uuid; delete params.uuid;

		Ext.Ajax.request({
			url: 'user/' + uuid,
			params: params,
			method: 'POST',
			success: Ext.Function.bind(this.handler_LoadStore, this)
		});
	},

	// Cell renderer to change bytes to megabytes.
	renderer_AdjustSize: function (value) {
		return (value / 1000000).toFixed(1) + ' MB';
	}
});