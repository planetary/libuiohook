
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#include <node.h>
#include <nan.h>
#include <nan_object_wrap.h>
#include <v8.h>
#include <vector>

#if defined(USE_X11)

#include "xdisplay.h" 
#include <stdlib.h> 
#include <unistd.h> 
#include <locale.h> 
#include <X11/Xlib.h> 
#include <X11/Xatom.h> 
#include <X11/cursorfont.h> 
#include <X11/Xlib.h> 
#include <X11/XKBlib.h> 
#include <X11/Xutil.h> 
#include "linux/input_helper.h" 

#endif

#include <queue>
#include <limits>
#include <inttypes.h>
#include "uiohook.h"

#if defined(IS_WINDOWS)
#include <Oleacc.h>
#include <Winuser.h>
#endif

#include "iohook.h"

#ifdef _WIN32
#include <windows.h>
#else
#if defined(__APPLE__) && defined(__MACH__)
#include <CoreFoundation/CoreFoundation.h>
#endif

#include <pthread.h>
#endif

using namespace v8;
using Callback = Nan::Callback;
static bool sIsRuning=false; 

static HookProcessWorker* sIOHook = nullptr;

static void dispatch_proc(uiohook_event * const event)
{
	if (sIOHook != nullptr && sIOHook->fHookExecution!=nullptr)
	{
		sIOHook->fHookExecution->Send(event, sizeof(uiohook_event));
	}
}

// static bool logger_proc(unsigned int level, const char *format, ...)
// {
// 	return true;
// }


HookProcessWorker::HookProcessWorker(Nan::Callback * callback) :
Nan::AsyncProgressWorkerBase<uiohook_event>(callback),
fHookExecution(nullptr)
{
	
}

void HookProcessWorker::Execute(const Nan::AsyncProgressWorkerBase<uiohook_event>::ExecutionProgress& progress)
{
	// hook_set_logger_proc(&logger_proc);
	hook_set_dispatch_proc(&dispatch_proc);
	fHookExecution = &progress;
	printf("\n\nhook_run\n\n");
	hook_run();
}

void HookProcessWorker::Stop()
{
	hook_stop();
	sIsRuning = false;
}
void HookProcessWorker::HandleProgressCallback(const uiohook_event *data, size_t size)
{
	HandleScope scope(Isolate::GetCurrent());
	v8::Local<v8::Object> obj = Nan::New<v8::Object>();

    if (data == NULL || data == nullptr || (data->type == NULL) || data->type < 0) { 
        return; 
    }

	Nan::AsyncResource resource("libuiohook-node:addon.HandleProgressCallback");
	
	Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New((uint16_t)data->type));
	Nan::Set(obj, Nan::New("mask").ToLocalChecked(), Nan::New((uint16_t)data->mask));
	if ((data->type >= EVENT_MOUSE_CLICKED) && (data->type < EVENT_MOUSE_WHEEL))
	{
		v8::Local<v8::Object> mouse = Nan::New<v8::Object>();
		Nan::Set(mouse, Nan::New("button").ToLocalChecked(), Nan::New((int)data->data.mouse.button));
		Nan::Set(mouse, Nan::New("clicks").ToLocalChecked(), Nan::New((int)data->data.mouse.clicks));
		Nan::Set(mouse, Nan::New("x").ToLocalChecked(), Nan::New((int)data->data.mouse.x));
		Nan::Set(mouse, Nan::New("y").ToLocalChecked(), Nan::New((int)data->data.mouse.y));

		Nan::Set(obj, Nan::New("mouse").ToLocalChecked(), mouse);
		v8::Local<v8::Value> argv[] = { obj };
		callback->Call(1, argv, &resource);
	}
	else if ((data->type >= EVENT_KEY_TYPED) && (data->type <= EVENT_KEY_RELEASED))
	{
		v8::Local<v8::Object> keyboard = Nan::New<v8::Object>();

		Nan::Set(keyboard, Nan::New("keychar").ToLocalChecked(), Nan::New((int)data->data.keyboard.keychar));
		Nan::Set(keyboard, Nan::New("keycode").ToLocalChecked(), Nan::New((int)data->data.keyboard.keycode));
		Nan::Set(keyboard, Nan::New("rawcode").ToLocalChecked(), Nan::New((int)data->data.keyboard.rawcode));
		Nan::Set(obj, Nan::New("keyboard").ToLocalChecked(), keyboard);
		v8::Local<v8::Value> argv[] = { obj };
		callback->Call(1, argv, &resource);
	}
	else if (data->type == EVENT_MOUSE_WHEEL)
	{
		v8::Local<v8::Object> wheel = Nan::New<v8::Object>();
		Nan::Set(wheel, Nan::New("amount").ToLocalChecked(), Nan::New((int)data->data.wheel.amount));
		Nan::Set(wheel, Nan::New("clicks").ToLocalChecked(), Nan::New((int)data->data.wheel.clicks));
		Nan::Set(wheel, Nan::New("direction").ToLocalChecked(), Nan::New((int)data->data.wheel.direction));
		Nan::Set(wheel, Nan::New("rotation").ToLocalChecked(), Nan::New((int)data->data.wheel.rotation));
		Nan::Set(wheel, Nan::New("wheeltype").ToLocalChecked(), Nan::New((int)data->data.wheel.type));
		Nan::Set(wheel, Nan::New("x").ToLocalChecked(), Nan::New((int)data->data.wheel.x));
		Nan::Set(wheel, Nan::New("y").ToLocalChecked(), Nan::New((int)data->data.wheel.y));

		Nan::Set(obj, Nan::New("wheel").ToLocalChecked(), wheel);
		v8::Local<v8::Value> argv[] = { obj };

		callback->Call(1, argv, &resource);
	}
	
}


NAN_METHOD(StartHook) {

    //allow one single execution
    if(sIsRuning==false)
    {
        if(info.Length() >0)
        {
			if (info[0]->IsFunction())
			{
				Callback* callback = new Callback(info[0].As<Function>());
				sIOHook = new HookProcessWorker(callback);
				Nan::AsyncQueueWorker(sIOHook);
				sIsRuning = true;
			}
        }
    }
}

NAN_METHOD(StopHook) {

	//allow one single execution
	if ((sIsRuning == true) && (sIOHook !=nullptr))
	{
		sIOHook->Stop();
	}
}

NAN_MODULE_INIT(InitAll)
{

    Nan::Set(target, Nan::New<String>("startHook").ToLocalChecked(),
             Nan::GetFunction(Nan::New<FunctionTemplate>(StartHook)).ToLocalChecked());

    Nan::Set(target, Nan::New<String>("stopHook").ToLocalChecked(),
             Nan::GetFunction(Nan::New<FunctionTemplate>(StopHook)).ToLocalChecked());
}

NODE_MODULE(iohookjs, InitAll)
