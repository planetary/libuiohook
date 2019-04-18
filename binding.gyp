{
    'targets': [
        {
            'target_name': 'iohook',
            'include_dirs': [
                "<!(node -e \"require('nan')\")",
                "include",
                "src"
            ],
            'cflags': [
                '-Wall',
                '-Wparentheses',
                '-Winline',
                '-Wbad-function-cast',
                '-Wdisabled-optimization',
                '-fexceptions'
            ],
            'cflags_cc': ['-fexceptions'],
            'cflags!': [ '-fno-exceptions' ],
            'cflags_cc!': [ '-fno-exceptions' ],

            "msvs_settings": {
                "VCCLCompilerTool": {
                'RuntimeLibrary': 2, # shared release
                'ExceptionHandling': 1,     # /EHsc  doesn't work.
                'AdditionalOptions': ['/EHsc']
                }
            },
            
            'conditions': [
                ['OS == "mac"', {
                'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                    },
                'include_dirs': [
                    'System/Library/Frameworks/CoreFoundation.Framework/Headers',
                    'System/Library/Frameworks/Foundation.framework/Headers',
                    'System/Library/Frameworks/Carbon.Framework/Headers',
                    'System/Library/Frameworks/ApplicationServices.framework/Headers',
                    'System/Library/Frameworks/IOKit.framework/Headers',
                    'System/Library/Frameworks/Cocoa.framework/Headers',
                    'System/Library/Frameworks/OpenGL.framework/Headers'
                ],
                "sources": [
                    "src/darwin/system_properties.c",
                    "src/darwin/input_helper.c",
                    "src/darwin/input_hook.c"
                ],
                'link_settings': {
                    'libraries': [
                    '-framework Carbon',
                    '-framework CoreFoundation',
                    '-framework ApplicationServices',
                    '-framework Cocoa',
                    '-framework Foundation',
                    '-framework OpenGL',
                    '-framework IOKit'
                    ]
                },
                }],
                
                ['OS == "linux"', {
                'link_settings': {
                    'libraries': [
                    '-lpng',
                    '-lz',
                    '-lX11',
                    '-lXtst'
                    ]
                },
                "sources": [
                    "src/linux/system_properties.c",
                    "src/linux/input_helper.c",
                    "src/linux/input_hook.c"
                ],
                }],

                ["OS=='win'", {
                'defines': ['IS_WINDOWS', '_HAS_EXCEPTIONS=1'],
                'link_settings': {
                    'libraries': [
                    'Oleacc',
                    "UIAutomationCore",
                    
                    "comsuppw"
                    ]
                },
                "sources": [
                    "src/windows/system_properties.c",
                    "src/windows/input_helper.c",
                    "src/windows/input_hook.c"
                ],
                }]
            ],
            'sources': [
                "src/iohook.cc",
                "src/logger.c"
            ]
        },
        {
            "target_name": "release",
            "type": "none",
            "dependencies": [ "iohook" ],
            "copies": [
                {
                "files": [ "<(PRODUCT_DIR)/iohook.node" ],
                "destination": "./lib"
                }
            ],
        },
    ]
}