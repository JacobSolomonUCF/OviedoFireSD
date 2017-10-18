package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.util.ArrayList;

/**
 * Created by David on 9/6/2017.
 */

public class ActiveJSONParser {
    public static ArrayList<Button> parseparse(String str, LinearLayout linearLayout, Context context){
        ArrayList<Button> buttons = new ArrayList();
        final Context context2=context;
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            JSONArray vehicles = object.getJSONArray("list");
            for (int i=0; i<vehicles.length(); i++){
                JSONObject object2=vehicles.getJSONObject(i);

                final String name=object2.getString("name");
                final String id=object2.getString("id");
                Button button=new Button(context);
                buttons.add(button);
                button.setText(name);
                button.setBackgroundColor(Color.BLACK);
                button.setTextColor(Color.WHITE);
                button.setHint(id);
                System.out.println(button.getHint());
                linearLayout.addView(button);
            }
        } catch (JSONException e) {
            Log.e("HEREHERE", "You got a JSON EXCEPTION?");
        }
        return buttons;
    }

}
