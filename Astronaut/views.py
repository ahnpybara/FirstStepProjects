from django.shortcuts import render
from rest_framework.views import APIView


class Sub(APIView):
    # Sub클래스를 get으로 호출했을 때 main.html을 브라우저에 보여줌
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        return render(request, "astronaut/main.html")

    # Sub클래스를 post로 호출했을 때 main.html을 브라우저에 보여줌
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        return render(request, "astronaut/main.html")
