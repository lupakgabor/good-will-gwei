export const abi = [
	{
		inputs: [],
		stateMutability: 'payable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'charityAddress',
				type: 'address',
			},
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'description',
				type: 'string',
			},
		],
		name: 'addCharity',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'beTheManager',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'charities',
		outputs: [
			{
				internalType: 'address',
				name: 'charityAddress',
				type: 'address',
			},
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'description',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: 'balance',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'index',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'charityAddresses',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'charityAddress',
				type: 'address',
			},
		],
		name: 'donate',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getAllCharityAddress',
		outputs: [
			{
				internalType: 'address[]',
				name: '',
				type: 'address[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'manager',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'charityAddress',
				type: 'address',
			},
		],
		name: 'removeCharity',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'withdraw',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
] as const;
