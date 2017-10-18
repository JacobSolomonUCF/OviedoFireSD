package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.graphics.Color;
import android.widget.Button;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by David on 9/28/2017.
 */

public class ToDoJSONParser {
    public static ArrayList<Button> toDoParse(String str, TableLayout mTableLayout, Context context){
        ArrayList<Button> buttons = new ArrayList();
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            JSONArray sections = object.getJSONArray("list");
            for (int i=0; i<sections.length(); i++){
                TableRow tableRow = new TableRow(context);
                mTableLayout.addView(tableRow);
                TextView textView = new TextView(context);
                JSONObject object2=sections.getJSONObject(i);
                String name=object2.getString("name");
                String formId=object2.getString("formId");
                String cb=object2.getString("completeBy");
                cb = "Complete by: "+cb;
                textView.setText(cb);
                Button button=new Button(context);
                buttons.add(button);
                button.setText(name);
                button.setBackgroundColor(Color.BLACK);
                button.setTextColor(Color.WHITE);
                button.setHint(formId);
                System.out.println(button.getHint());
                tableRow.addView(button);
                tableRow.addView(textView);
            }
        } catch (JSONException e) {
            // Appropriate error handling code
        }
        return buttons;
    }
}
