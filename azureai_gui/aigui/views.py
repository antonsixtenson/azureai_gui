from django.shortcuts import render
from django.http import JsonResponse
import json

def index(request):        
    return render(request, "index.html")

def analyze_text(request):
    reply = ""

    if request.method == "POST":
        data = json.loads(request.body)
        user_input = data.get("user_input", "")
        print(f"USER INPUT: {user_input}")
        if "code" in user_input:
            print("CODE WAS IN USER INPUT")
            reply = """
            some string before
                [CODE-START]
                i = 0
                if i > 4:
                    print(f"i: {i} hello world")
                else:
                    i += 1
                    continue
                [CODE-END]
            and some after
            more text
            """
        elif "nice" in user_input:
            reply = "Hello beautiful"
        else:
            reply = "No predefined string"

        return JsonResponse({"ai_reply": reply})

def update_settings_values(request):
    status = False
    newSettings = dict()
    if request.method == "POST":
        data = json.loads(request.body)
        for k, v in data["value"].items():
            if v:
               newSettings[k] = v
        status = True
    return JsonResponse({"update_status": status})